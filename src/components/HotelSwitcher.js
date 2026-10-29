"use client";

import { useEffect, useState } from "react";

// Compte qui gère plusieurs hôtels : choisir celui qu'on consulte. N'apparaît pas s'il n'y en a qu'un.
export default function HotelSwitcher() {
  const [state, setState] = useState({ hotels: [], current: null });

  useEffect(() => {
    fetch("/api/hotel/switch", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setState({ hotels: d.hotels ?? [], current: d.current ?? null }))
      .catch(() => {});
  }, []);

  if (state.hotels.length < 2) return null;

  async function change(e) {
    const res = await fetch("/api/hotel/switch", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ hotelId: e.target.value }) });
    if (res.ok) window.location.reload();
  }

  return (
    <select value={state.current ?? ""} onChange={change} aria-label="Changer d'hôtel" className="max-w-[14rem] rounded-full bg-ink px-4 py-2 text-xs font-bold uppercase tracking-widest text-sand">
      {state.hotels.map((h) => (
        <option key={h.id} value={h.id}>{h.name}</option>
      ))}
    </select>
  );
}
