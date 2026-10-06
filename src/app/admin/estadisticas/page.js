import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getLocale } from "@/lib/i18n/locale";
import { getLivretStats, eventLabels } from "@/lib/livretStats";

export const metadata = { robots: { index: false, follow: false } };

const content = {
  fr: {
    title: "Statistiques des livrets",
    intro: "Ouvertures et boutons comptés depuis le 6 octobre 2026. Les check-ins comptent depuis le début.",
    property: "Logement",
    host: "Hôte",
    plan: "Offre",
    opens: "Ouvertures",
    opens30: "30 j",
    topButtons: "Boutons les plus utilisés",
    checkins: "Check-ins",
    checkinsTitle: "Voyageurs ayant fait le check-in",
    guest: "Voyageur",
    arrival: "Arrivée",
    departure: "Départ",
    doneOn: "Check-in fait le",
    verification: "Vérification",
    noCheckins: "Aucun check-in pour l'instant.",
    status: { pendiente: "En attente", aprobado: "Approuvé", rechazado: "Refusé" },
  },
  en: {
    title: "Livret statistics",
    intro: "Opens and buttons counted since 6 October 2026. Check-ins are counted from the start.",
    property: "Property",
    host: "Host",
    plan: "Plan",
    opens: "Opens",
    opens30: "30 d",
    topButtons: "Most used buttons",
    checkins: "Check-ins",
    checkinsTitle: "Guests who completed check-in",
    guest: "Guest",
    arrival: "Arrival",
    departure: "Departure",
    doneOn: "Checked in on",
    verification: "Verification",
    noCheckins: "No check-in yet.",
    status: { pendiente: "Pending", aprobado: "Approved", rechazado: "Rejected" },
  },
  es: {
    title: "Estadísticas de los livrets",
    intro: "Aperturas y botones contados desde el 6 de octubre de 2026. Los check-ins cuentan desde el principio.",
    property: "Alojamiento",
    host: "Anfitrión",
    plan: "Plan",
    opens: "Aperturas",
    opens30: "30 d",
    topButtons: "Botones más usados",
    checkins: "Check-ins",
    checkinsTitle: "Huéspedes que hicieron el check-in",
    guest: "Huésped",
    arrival: "Llegada",
    departure: "Salida",
    doneOn: "Check-in hecho el",
    verification: "Verificación",
    noCheckins: "Todavía no hay check-ins.",
    status: { pendiente: "Pendiente", aprobado: "Aprobado", rechazado: "Rechazado" },
  },
};

const th = "px-4 py-2 font-bold text-ink/70";
const td = "px-4 py-2 text-ink";

export default async function AdminEstadisticasPage() {
  const locale = await getLocale();
  const t = content[locale];
  const labels = eventLabels[locale];

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) notFound();
  const { data: me } = await supabase.from("hosts").select("is_admin").eq("id", user.id).single();
  if (!me?.is_admin) notFound();

  const admin = createAdminClient();
  const [{ data: properties }, { data: checkins }] = await Promise.all([
    admin.from("properties").select("id, name, city, plan, hosts(name, email)").order("name", { ascending: true }),
    admin
      .from("reservations")
      .select(
        "id, guest_name, arrival_date, departure_date, properties(name), guest_accounts(first_name, last_name, verification_status, created_at)"
      )
      .eq("status", "check-in hecho")
      .order("arrival_date", { ascending: false }),
  ]);

  const stats = await getLivretStats((properties ?? []).map((p) => p.id));
  const rows = (properties ?? [])
    .map((p) => ({ ...p, ...stats.get(p.id) }))
    .sort((a, b) => b.opens - a.opens || b.checkins - a.checkins);
  const dateFormatter = new Intl.DateTimeFormat({ fr: "fr-FR", en: "en-GB", es: "es-ES" }[locale], {
    dateStyle: "medium",
  });
  const formatDate = (value) => (value ? dateFormatter.format(new Date(value)) : "—");

  return (
    <main className="flex-1 bg-sand">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <Link href="/admin" className="text-sm font-bold text-aqua-deep">
          ← Admin
        </Link>
        <h1 className="mt-3 font-display italic text-3xl text-ink">{t.title}</h1>
        <p className="mt-2 text-ink/70">{t.intro}</p>

        <div className="mt-6 overflow-x-auto rounded border border-sand-dim">
          <table className="w-full min-w-[760px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-sand-dim bg-sand-card text-left">
                <th className={th}>{t.property}</th>
                <th className={th}>{t.host}</th>
                <th className={th}>{t.plan}</th>
                <th className={`${th} text-right`}>{t.opens}</th>
                <th className={`${th} text-right`}>{t.opens30}</th>
                <th className={th}>{t.topButtons}</th>
                <th className={`${th} text-right`}>{t.checkins}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} className="border-b border-sand-dim last:border-0">
                  <td className={td}>
                    {p.name} <span className="text-ink/50">({p.city})</span>
                  </td>
                  <td className={td}>{p.hosts?.name ?? "—"}</td>
                  <td className={td}>{p.plan ?? "—"}</td>
                  <td className={`${td} text-right tabular-nums`}>{p.opens}</td>
                  <td className={`${td} text-right tabular-nums`}>{p.opens30}</td>
                  <td className={`${td} text-ink/70`}>
                    {p.buttons.length === 0
                      ? "—"
                      : p.buttons
                          .slice(0, 3)
                          .map((b) => `${labels[b.event] ?? b.event} (${b.total})`)
                          .join(", ")}
                  </td>
                  <td className={`${td} text-right tabular-nums`}>
                    {p.checkins}
                    <span className="text-ink/50"> / {p.reservations}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mt-12 font-display italic text-2xl text-ink">{t.checkinsTitle}</h2>
        {(checkins ?? []).length === 0 ? (
          <p className="mt-3 text-ink/60">{t.noCheckins}</p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded border border-sand-dim">
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-sand-dim bg-sand-card text-left">
                  <th className={th}>{t.guest}</th>
                  <th className={th}>{t.property}</th>
                  <th className={th}>{t.arrival}</th>
                  <th className={th}>{t.departure}</th>
                  <th className={th}>{t.doneOn}</th>
                  <th className={th}>{t.verification}</th>
                </tr>
              </thead>
              <tbody>
                {checkins.map((r) => {
                  const g = Array.isArray(r.guest_accounts) ? r.guest_accounts[0] : r.guest_accounts;
                  const name = [g?.first_name, g?.last_name].filter(Boolean).join(" ") || r.guest_name;
                  return (
                    <tr key={r.id} className="border-b border-sand-dim last:border-0">
                      <td className={td}>{name}</td>
                      <td className={td}>{r.properties?.name ?? "—"}</td>
                      <td className={td}>{formatDate(r.arrival_date)}</td>
                      <td className={td}>{formatDate(r.departure_date)}</td>
                      <td className={td}>{formatDate(g?.created_at)}</td>
                      <td className={td}>{t.status[g?.verification_status] ?? "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
