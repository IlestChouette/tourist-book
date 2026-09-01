import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendTransferRequestWhatsApp } from "@/lib/whatsapp";
import { sendTransferRequestNotification } from "@/lib/email";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const propertyId = searchParams.get("propertyId");
  if (!propertyId) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: property } = await admin
    .from("properties")
    .select("id")
    .eq("id", propertyId)
    .eq("host_id", user.id)
    .single();
  if (!property) {
    return NextResponse.json({ error: "Logement introuvable" }, { status: 404 });
  }

  const { data, error } = await admin
    .from("requests")
    .select("*")
    .eq("property_id", propertyId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data ?? []);
}

export async function POST(request) {
  const body = await request.json();
  const { slug, type, nom, telephone, ...rest } = body;
  if (!slug || !type || !nom) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: property } = await admin
    .from("properties")
    .select("id, name, hosts(email)")
    .eq("slug", slug)
    .single();
  if (!property) {
    return NextResponse.json({ error: "Logement introuvable" }, { status: 404 });
  }

  delete rest.property;

  const { data: inserted, error } = await admin
    .from("requests")
    .insert({
      property_id: property.id,
      type,
      nom,
      telephone: telephone ?? null,
      details: rest,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (type === "transfert") {
    try {
      const result = await sendTransferRequestWhatsApp({ ...inserted, propertyName: property.name });
      if (result.sent) {
        await admin.from("requests").update({ whatsapp_sent: true }).eq("id", inserted.id);
      }
    } catch (err) {
      // Envoi WhatsApp best-effort : la demande est déjà enregistrée même si ça échoue.
      console.error("sendTransferRequestWhatsApp failed:", err);
    }

    try {
      const emailResult = await sendTransferRequestNotification({
        hostEmail: property.hosts?.email,
        propertyName: property.name,
        request: inserted,
      });
      console.log("sendTransferRequestNotification result:", emailResult, "hostEmail:", property.hosts?.email);
    } catch (err) {
      // Envoi email best-effort : la demande est déjà enregistrée même si ça échoue.
      console.error("sendTransferRequestNotification failed:", err);
    }
  }

  return NextResponse.json(inserted, { status: 201 });
}
