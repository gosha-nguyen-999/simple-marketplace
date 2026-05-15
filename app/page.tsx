"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp, displayName } from "./context/AppContext";

const RARITY_COLORS: Record<string, { accent: string }> = {
  Common:    { accent: "#94a3b8" },
  Uncommon:  { accent: "#22c55e" },
  Rare:      { accent: "#3b82f6" },
  Epic:      { accent: "#a855f7" },
  Legendary: { accent: "#eab308" },
  Exotic:    { accent: "#f43f5e" },
};

const GAME_FILTERS = [
  { label: "All Games", value: "all", emoji: "🎮", color: "#a855f7" },
  { label: "CS2", value: "CS2", emoji: "🔫", color: "#f97316" },
  { label: "Valorant", value: "Valorant", emoji: "⚡", color: "#ef4444" },
  { label: "Fortnite", value: "Fortnite", emoji: "⛏️", color: "#06b6d4" },
  { label: "Roblox", value: "Roblox", emoji: "🟥", color: "#ef4444" },
];

type SortKey = "newest" | "price-asc" | "price-desc";

export default function Home() {
  const { user, signOut, listings } = useApp();
  const router = useRouter();
  const [activeGame, setActiveGame] = useState("all");
  const [sort, setSort] = useState<SortKey>("newest");
  const [search, setSearch] = useState("");

  const filtered = listings
    .filter((l) => activeGame === "all" || l.game === activeGame)
    .filter((l) =>
      search === "" ||
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.game.toLowerCase().includes(search.toLowerCase()) ||
      l.category.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      return b.id - a.id;
    });

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d14", color: "#f0f0f0" }}>
      {/* Nav */}
      <nav style={{ background: "rgba(13,13,20,0.95)", borderBottom: "1px solid rgba(255,255,255,0.08)", position: "sticky", top: 0, zIndex: 50, backdropFilter: "blur(12px)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <span style={{ fontSize: 22, fontWeight: 900, background: "linear-gradient(135deg, #a855f7, #3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>VaultTrade</span>
            <span style={{ fontSize: 11, background: "#a855f7", color: "#fff", borderRadius: 4, padding: "2px 6px", fontWeight: 700, letterSpacing: "0.05em" }}>BETA</span>
          </a>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {user ? (
              <>
                <button onClick={() => router.push("/sell")} style={{ background: "linear-gradient(135deg, #a855f7, #3b82f6)", color: "#fff", padding: "8px 18px", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 700, border: "none" }}>
                  + Sell
                </button>
                <span style={{ fontSize: 14, color: "#94a3b8" }}>
                  {displayName(user)}
                </span>
                <button onClick={signOut} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "#f0f0f0", padding: "8px 18px", borderRadius: 8, cursor: "pointer", fontSize: 14 }}>
                  Log out
                </button>
              </>
            ) : (
              <>
                <button onClick={() => router.push("/login")} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "#f0f0f0", padding: "8px 18px", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 500 }}>
                  Log in
                </button>
                <button onClick={() => router.push("/signup")} style={{ background: "linear-gradient(135deg, #a855f7, #3b82f6)", color: "#fff", padding: "8px 18px", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 700, border: "none" }}>
                  Sign up
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg, #1a0533 0%, #0d0d14 40%, #001233 100%)", padding: "72px 24px 56px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, left: "20%", width: 400, height: 400, background: "radial-gradient(circle, rgba(168,85,247,0.15), transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: -40, right: "15%", width: 300, height: 300, background: "radial-gradient(circle, rgba(59,130,246,0.12), transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 720, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.3)", borderRadius: 100, padding: "6px 16px", marginBottom: 24, fontSize: 13, color: "#c084fc" }}>
            <span>⚡</span> The #1 marketplace for in-game assets
          </div>
          <h1 style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 20, letterSpacing: "-0.02em" }}>
            Buy & sell{" "}
            <span style={{ background: "linear-gradient(135deg, #a855f7, #3b82f6, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              game assets
            </span>
            {" "}instantly
          </h1>
          <p style={{ fontSize: 18, color: "#94a3b8", marginBottom: 36, lineHeight: 1.6 }}>
            CS2 skins, Valorant bundles, Fortnite outfits, Roblox limiteds — all in one place.
          </p>
          <div style={{ display: "flex", gap: 12, maxWidth: 560, margin: "0 auto 48px" }}>
            <input
              type="text"
              placeholder="Search skins, knives, outfits..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ flex: 1, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, padding: "14px 18px", color: "#f0f0f0", fontSize: 15, outline: "none" }}
            />
            <button style={{ background: "linear-gradient(135deg, #a855f7, #3b82f6)", color: "#fff", border: "none", borderRadius: 12, padding: "14px 24px", fontWeight: 700, cursor: "pointer", fontSize: 15, whiteSpace: "nowrap" }}>
              Search
            </button>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 40, flexWrap: "wrap" }}>
            {[["124K+", "Listings"], ["8,400+", "Sellers"], ["20+", "Games"], ["2.1M+", "Trades"]].map(([num, label]) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 26, fontWeight: 900, background: "linear-gradient(135deg, #a855f7, #3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{num}</div>
                <div style={{ fontSize: 13, color: "#64748b" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {GAME_FILTERS.map((g) => (
              <button
                key={g.value}
                onClick={() => setActiveGame(g.value)}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "10px 18px", borderRadius: 100, border: "1px solid",
                  borderColor: activeGame === g.value ? g.color : "rgba(255,255,255,0.12)",
                  background: activeGame === g.value ? `${g.color}22` : "rgba(255,255,255,0.04)",
                  color: activeGame === g.value ? g.color : "#94a3b8",
                  fontWeight: activeGame === g.value ? 700 : 500,
                  cursor: "pointer", fontSize: 14, transition: "all 0.15s",
                }}
              >
                <span>{g.emoji}</span> {g.label}
              </button>
            ))}
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, padding: "10px 14px", color: "#f0f0f0", fontSize: 14, cursor: "pointer", outline: "none" }}
          >
            <option value="newest">Newest first</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
          </select>
        </div>
      </div>

      {/* Listings Grid */}
      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 24px 64px" }}>
        <p style={{ color: "#64748b", fontSize: 14, marginBottom: 20 }}>
          {filtered.length} listing{filtered.length !== 1 ? "s" : ""} found
        </p>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#64748b" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <p style={{ fontSize: 18, fontWeight: 600, color: "#94a3b8" }}>No listings found</p>
            <p style={{ fontSize: 14, marginTop: 8 }}>Try a different search or game filter</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>
            {filtered.map((item) => {
              const accent = RARITY_COLORS[item.rarity]?.accent ?? "#94a3b8";
              return (
                <div
                  key={item.id}
                  onClick={() => router.push(`/listings/${item.id}`)}
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 16, overflow: "hidden",
                    transition: "transform 0.15s, box-shadow 0.15s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 40px rgba(0,0,0,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                  }}
                >
                  <div style={{ background: "linear-gradient(135deg, rgba(168,85,247,0.1), rgba(59,130,246,0.1))", height: 140, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 64, position: "relative" }}>
                    {item.emoji}
                    <span style={{ position: "absolute", top: 10, right: 10, fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 6, background: "rgba(0,0,0,0.6)", color: accent }}>
                      {item.rarity}
                    </span>
                  </div>
                  <div style={{ padding: "14px 16px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 7px", borderRadius: 4, background: "rgba(255,255,255,0.08)", color: "#94a3b8" }}>{item.game}</span>
                      <span style={{ fontSize: 11, color: "#64748b" }}>{item.category}</span>
                    </div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4, color: "#f0f0f0", lineHeight: 1.3 }}>{item.name}</h3>
                    <p style={{ fontSize: 12, color: "#64748b", marginBottom: 12 }}>{item.condition}</p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 20, fontWeight: 900, color: "#f0f0f0" }}>
                        ${item.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); router.push(`/listings/${item.id}`); }}
                        style={{ background: "linear-gradient(135deg, #a855f7, #3b82f6)", color: "#fff", border: "none", borderRadius: 8, padding: "8px 14px", fontWeight: 700, cursor: "pointer", fontSize: 13 }}
                      >
                        Buy Now
                      </button>
                    </div>
                    <p style={{ fontSize: 11, color: "#475569", marginTop: 8 }}>
                      Seller: <a href={`/sellers/${encodeURIComponent(item.seller)}`} onClick={(e) => e.stopPropagation()} style={{ color: "#64748b", textDecoration: "none" }}>{item.seller}</a>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)", padding: "40px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 900, background: "linear-gradient(135deg, #a855f7, #3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 6 }}>VaultTrade</div>
            <p style={{ fontSize: 13, color: "#475569" }}>Your vault for in-game riches.</p>
          </div>
          <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
            {[["Browse", ["CS2", "Valorant", "Fortnite", "Roblox"]], ["Company", ["About", "Blog", "Careers"]], ["Support", ["Help Center", "Terms", "Privacy"]]].map(([section, links]) => (
              <div key={section as string}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.08em" }}>{section as string}</p>
                {(links as string[]).map((link) => (
                  <p key={link} style={{ fontSize: 13, color: "#475569", marginBottom: 6, cursor: "pointer" }}>{link}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div style={{ maxWidth: 1280, margin: "24px auto 0", paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.04)", textAlign: "center", fontSize: 12, color: "#334155" }}>
          © 2026 VaultTrade. All rights reserved. Not affiliated with any game publishers.
        </div>
      </footer>
    </div>
  );
}
