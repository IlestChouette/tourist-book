import { ImageResponse } from "next/og";
import { createAdminClient } from "@/lib/supabase/admin";
import { listHotelSlugs } from "@/lib/hotelSlug";
import { themeById } from "@/lib/hotelTheme";

export const alt = "Cahier de consignes de l'hôtel";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Image de l'aperçu du lien du cahier (WhatsApp, e-mail…) : le logo et le nom de l'hôtel,
// sur la couleur de son cahier. Le logo n'est lu que s'il vient de notre propre stockage.
export default async function Image({ params }) {
  const { slug } = await params;
  const admin = createAdminClient();
  const entry = (await listHotelSlugs(admin)).find((h) => h.slug === slug);
  let name = "Cahier de consignes";
  let logo = null;
  let band = "#6fc7be";
  if (entry) {
    const { data: hotel } = await admin.from("hotels").select("name, logo_url, theme").eq("id", entry.id).single();
    name = hotel?.name ?? entry.name;
    band = themeById(hotel?.theme).band || band;
    const own = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/`;
    if (hotel?.logo_url && hotel.logo_url.startsWith(own)) logo = hotel.logo_url;
  }
  const fontSize = name.length <= 18 ? 92 : name.length <= 32 ? 72 : 56;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#f7f1e4", color: "#223339" }}>
        <div style={{ display: "flex", height: 28, background: band }} />
        <div style={{ display: "flex", flex: 1, alignItems: "center", padding: "0 80px", gap: 64 }}>
          {logo && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 340, height: 340, borderRadius: 170, background: "#ffffff", border: `6px solid ${band}`, overflow: "hidden" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logo} alt="" width={300} height={300} style={{ objectFit: "contain" }} />
            </div>
          )}
          <div style={{ display: "flex", flex: 1, flexDirection: "column", gap: 24 }}>
            <div style={{ display: "flex", fontSize, fontWeight: 700, lineHeight: 1.08 }}>{name}</div>
            <div style={{ display: "flex", fontSize: 40, color: "#55646a" }}>Cahier de consignes</div>
          </div>
        </div>
        <div style={{ display: "flex", height: 28, background: band }} />
      </div>
    ),
    { ...size },
  );
}
