"use client";

import { useRouter, useParams } from "next/navigation";
import { useApp } from "../../context/AppContext";

const RARITY_ACCENT: Record<string, string> = {
  Common: "#94a3b8", Uncommon: "#22c55e", Rare: "#3b82f6",
  Epic: "#a855f7", Legendary: "#eab308", Exotic: "#f43f5e",
};

function avatarInitials(name: string) {
  return name.slice(0, 2).toUpperCase();
}

export default function SellerPage() {
  const { listings, user } = useApp();
  const router = useRouter();
  const params = useParams();
  const sellerName = decodeURIComponent(params.name as string);

  const sellerListings = listings.filter((l) => l.seller === sellerName);
  const sellerEmail = sellerListings[0]?.sellerEmail;

  if (sellerListings.length === 0) {
    return (
      <div style={{ minHeight: "100vh", background: "#0d0d14", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, color: "#f0f0f0" }}>
        <div style={{ fontSize: 48 }}>👤</div>
        <h2 style={{ fontSize: 22, fontWeight: 700 }}>Seller not found</h2>
        <button onClick={() => router.push("/")} style={{ background: "linear-gradient(135deg, #a855f7, #3b82f6)", color: "#fff", border: "none", borderRadius: 8, padding: "10px 22px", cursor: "pointer", fontWeight: 700 }}>Back to marketplace</button>
      </div>
    );
  }

  const totalValue = sellerListings.reduce((s, l) => s + l.price, 0);
  const games = [...new Set(sellerListings.map((l) => l.game))];

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d14", color: "#f0f0f0" }}>
      {/* Nav */}
      <nav style={{ background: "rgba(13,13,20,0.95)", borderBottom: "1px solid rgba(255,255,255,0.08)", position: "sticky", top: 0, zIndex: 50, backdropFilter: "blur(12px)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ fontSize: 22, fontWeight: 900, background: "linear-gradient(135deg, #a855f7, #3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", textDecoration: "none" }}>VaultTrade</a>
          <div style={{ display: "flex", gap: 12 }}>
            {user ? (
              <button onClick={() => router.push("/sell")} style={{ background: "linear-gradient(135deg, #a855f7, #3b82f6)", color: "#fff", border: "none", borderRadius: 8, padding: "8px 18px", cursor: "pointer", fontWeight: 700, fontSize: 14 }}>+ Sell</button>
            ) : (
              <>
                <button onClick={() => router.push("/login")} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "#f0f0f0", padding: "8px 18px", borderRadius: 8, cursor: "pointer", fontSize: 14 }}>Log in</button>
                <button onClick={() => router.push("/signup")} style={{ background: "linear-gradient(135deg, #a855f7, #3b82f6)", color: "#fff", border: "none", padding: "8px 18px", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 14 }}>Sign up</button>
              </>
            )}
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px" }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: 13, color: "#64748b", marginBottom: 32, display: "flex", gap: 8 }}>
          <a href="/" style={{ color: "#64748b", textDecoration: "none" }}>Marketplace</a>
          <span>›</span>
          <span style={{ color: "#94a3b8" }}>{sellerName}</span>
        </div>

        {/* Seller header */}
        <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 40, flexWrap: "wrap" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, #a855f7, #3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 900, color: "#fff", flexShrink: 0 }}>
            {avatarInitials(sellerName)}
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 6 }}>{sellerName}</h1>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <span style={{ fontSize: 13, color: "#64748b" }}>🎮 {games.join(", ")}</span>
              <span style={{ fontSize: 13, color: "#64748b" }}>📦 {sellerListings.length} listing{sellerListings.length !== 1 ? "s" : ""}</span>
              <span style={{ fontSize: 13, color: "#64748b" }}>💰 ${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })} total value</span>
            </div>
          </div>
          {sellerEmail && (
            <a href={`mailto:${sellerEmail}`} style={{ background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.3)", color: "#c084fc", padding: "10px 20px", borderRadius: 10, textDecoration: "none", fontSize: 14, fontWeight: 600 }}>
              ✉️ Contact
            </a>
          )}
        </div>

        {/* Listings */}
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, color: "#94a3b8" }}>Active listings</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>
          {sellerListings.map((item) => {
            const accent = RARITY_ACCENT[item.rarity] ?? "#94a3b8";
            return (
              <div
                key={item.id}
                onClick={() => router.push(`/listings/${item.id}`)}
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, overflow: "hidden", cursor: "pointer", transition: "transform 0.15s, box-shadow 0.15s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 40px rgba(0,0,0,0.4)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}
              >
                <div style={{ background: "linear-gradient(135deg, rgba(168,85,247,0.1), rgba(59,130,246,0.1))", height: 120, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52, position: "relative" }}>
                  {item.emoji}
                  <span style={{ position: "absolute", top: 8, right: 8, fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 6, background: "rgba(0,0,0,0.6)", color: accent }}>{item.rarity}</span>
                </div>
                <div style={{ padding: "12px 14px 14px" }}>
                  <div style={{ display: "flex", gap: 6, marginBottom: 4 }}>
                    <span style={{ fontSize: 11, padding: "2px 6px", borderRadius: 4, background: "rgba(255,255,255,0.08)", color: "#94a3b8" }}>{item.game}</span>
                  </div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, color: "#f0f0f0" }}>{item.name}</h3>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 18, fontWeight: 900 }}>${item.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                    <span style={{ fontSize: 12, color: "#64748b" }}>{item.condition}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
