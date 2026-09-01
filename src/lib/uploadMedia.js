const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.82;
const SKIP_RESIZE_UNDER_BYTES = 1_200_000;

// Réduit une photo côté navigateur avant l'envoi : les photos de téléphone
// (plusieurs Mo, parfois HEIC) dépassent la limite de taille de requête des
// fonctions serverless de Vercel, qui rejette alors la requête avant même
// d'atteindre /api/upload — d'où une réponse non-JSON et un échec au
// parsing (Safari : "The string did not match the expected pattern.").
export async function resizeImage(file) {
  if (!file.type.startsWith("image/") || file.size < SKIP_RESIZE_UNDER_BYTES) {
    return file;
  }

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY));
    if (!blob) return file;

    return new File([blob], file.name.replace(/\.\w+$/, ".jpg"), { type: "image/jpeg" });
  } catch {
    // Si la compression échoue pour une raison quelconque, on tente l'envoi
    // du fichier original plutôt que de bloquer l'utilisateur.
    return file;
  }
}

// Sube un fichero al bucket "media" a través de nuestro propio servidor
// (ver /api/upload) en vez de directamente desde el navegador, y devuelve su
// URL pública. El path debe empezar por el id del hotelero conectado
// (ej. `${hostId}/logo.png`).
export async function uploadMedia(path, file) {
  const uploadFile = await resizeImage(file);

  const formData = new FormData();
  formData.append("file", uploadFile);
  formData.append("path", path);

  const res = await fetch("/api/upload", { method: "POST", body: formData });

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error(
      "No se pudo subir la foto (puede ser demasiado grande). Prueba con otra foto o recórtala primero."
    );
  }

  if (!res.ok) {
    throw new Error(data.error || "Error al subir el fichero");
  }

  return data.url;
}
