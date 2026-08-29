// Sube un fichero al bucket "media" a través de nuestro propio servidor
// (ver /api/upload) en vez de directamente desde el navegador, y devuelve su
// URL pública. El path debe empezar por el id del hotelero conectado
// (ej. `${hostId}/logo.png`).
export async function uploadMedia(path, file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("path", path);

  const res = await fetch("/api/upload", { method: "POST", body: formData });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Error al subir el fichero");
  }

  return data.url;
}
