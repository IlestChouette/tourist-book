import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Sube el fichero desde el servidor (con la clave service_role) en vez de
// directamente desde el navegador: evita depender de la verificación del
// token JWT por el servicio de Storage, que en este proyecto no reconoce
// correctamente las sesiones (ver diagnóstico — probablemente ligado a las
// nuevas claves de firma ES256 de Supabase). El servidor sigue verificando
// que quien pide la subida esté conectado antes de aceptar el fichero.
export async function POST(request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const path = formData.get("path");

  if (!file || !path || typeof path !== "string") {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  // El primer segmento del path debe ser el propio usuario (misma regla que
  // la política de Storage que queríamos aplicar).
  if (!path.startsWith(`${user.id}/`)) {
    return NextResponse.json({ error: "Ruta no permitida" }, { status: 403 });
  }

  const admin = createAdminClient();
  const arrayBuffer = await file.arrayBuffer();

  const { error } = await admin.storage.from("media").upload(path, arrayBuffer, {
    upsert: true,
    contentType: file.type,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data } = admin.storage.from("media").getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl });
}
