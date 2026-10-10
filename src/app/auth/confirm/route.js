import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendHostSignupNotification, sendHotelSignupNotification } from "@/lib/email";

// Lien du mail de confirmation. Il valide l'adresse, ouvre la session (l'hôtelier
// arrive connecté, sans retaper son mot de passe) et crée son profil : avant la
// confirmation il n'a pas de session, donc la RLS interdisait au formulaire
// d'inscription de l'écrire. Nom, téléphone et acceptation des conditions
// voyagent dans les métadonnées de l'utilisateur.
//
// Deux formes de lien : token_hash (celui du modèle d'email, fonctionne depuis
// n'importe quel navigateur ou app mail) et code (lien PKCE par défaut de
// Supabase, qui exige le même navigateur que l'inscription).
const CONFIRMABLE_TYPES = ["signup", "email", "recovery"];

// Redirection après validation : uniquement un chemin interne du panel, pour
// qu'un lien piégé ne puisse pas renvoyer l'hôtelier vers un autre site.
function safeNext(value) {
  return typeof value === "string" &&
    (value.startsWith("/panel") || value.startsWith("/hotel")) &&
    !value.includes("//") &&
    !value.includes("\\")
    ? value
    : "/panel";
}

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const code = searchParams.get("code");
  const next = safeNext(searchParams.get("next"));

  const supabase = await createClient();
  let error = null;
  if (tokenHash && CONFIRMABLE_TYPES.includes(type)) {
    ({ error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type }));
  } else if (code) {
    ({ error } = await supabase.auth.exchangeCodeForSession(code));
  } else {
    error = new Error("missing token");
  }

  if (error) {
    return NextResponse.redirect(new URL("/panel/login?confirm=error", origin));
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  // Un compte créé depuis l'espace hôtels est un hôtel, pas un hôtelier de
  // logements : pas de fiche "hosts" (il recevrait les relances Airbnb), mais
  // un hôtel, ses étiquettes de départ, et on l'envoie sur sa configuration.
  if (user?.user_metadata?.account_type === "hotel") {
    await ensureHotel(user);
    return NextResponse.redirect(new URL(type === "recovery" ? next : "/hotel/gestion", origin));
  }

  if (user) await ensureHostProfile(user);

  return NextResponse.redirect(new URL(next, origin));
}

async function ensureHostProfile(user) {
  const admin = createAdminClient();
  const { data: existing } = await admin.from("hosts").select("id").eq("id", user.id).maybeSingle();
  if (existing) return;

  const meta = user.user_metadata ?? {};
  const { error } = await admin.from("hosts").insert({
    id: user.id,
    email: user.email,
    name: meta.name || user.email,
    phone: meta.phone || null,
    accepted_terms_at: meta.accepted_terms_at || null,
  });
  if (error) {
    console.error("ensureHostProfile failed:", error);
    return;
  }

  try {
    await sendHostSignupNotification({ name: meta.name, email: user.email, phone: meta.phone });
  } catch (err) {
    // Best-effort : le profil est déjà créé même si l'email d'alerte échoue.
    console.error("sendHostSignupNotification failed:", err);
  }
}

const SHIFT_TAGS = ["matin", "soir", "nuit"];
const ROLE_TAGS = [
  "réception",
  "conciergerie",
  "technique",
  "housekeeping",
  "gouvernante",
  "réservation",
  "bagagiste",
  "voiturier",
];

async function ensureHotel(user) {
  const admin = createAdminClient();
  const { data: existing } = await admin.from("hotels").select("id").eq("owner_id", user.id).maybeSingle();
  if (existing) return;

  const meta = user.user_metadata ?? {};
  const hotelName = (meta.hotel_name || "Mon hôtel").slice(0, 120);
  const { data: hotel, error } = await admin
    .from("hotels")
    .insert({ owner_id: user.id, name: hotelName, notification_emails: [user.email] })
    .select("id")
    .single();
  if (error) {
    console.error("ensureHotel failed:", error);
    return;
  }

  await admin.from("hotel_staff").insert({ hotel_id: hotel.id, name: meta.name || "Manager", is_manager: true });
  await admin.from("hotel_tags").insert([
    ...SHIFT_TAGS.map((name) => ({ hotel_id: hotel.id, name, kind: "shift" })),
    ...ROLE_TAGS.map((name) => ({ hotel_id: hotel.id, name, kind: "role" })),
  ]);

  try {
    await sendHotelSignupNotification({ hotelName, name: meta.name, email: user.email });
  } catch (err) {
    console.error("sendHotelSignupNotification failed:", err);
  }
}
