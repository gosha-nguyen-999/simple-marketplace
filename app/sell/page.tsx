"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp, displayName } from "../context/AppContext";

const GAMES = ["CS2", "Valorant", "Fortnite", "Roblox", "Other"];
const CATEGORIES: Record<string, string[]> = {
  CS2: ["Skin", "Knife", "Gloves", "Case"],
  Valorant: ["Gun Skin", "Agent", "Bundle"],
  Fortnite: ["Outfit", "Pickaxe", "Emote", "V-Bucks"],
  Roblox: ["Accessory", "Game Pass", "Limited"],
  Other: ["Item", "Currency", "Account", "Other"],
};
const CONDITIONS = ["Factory New", "Minimal Wear", "Field-Tested", "Well-Worn", "Battle-Scarred", "Unused", "Account-Bound", "Tradeable", "Transferable"];
const RARITIES = ["Common", "Uncommon", "Rare", "Epic", "Legendary", "Exotic"];
const EMOJIS = ["🔪", "🔫", "🧤", "🎯", "⚡", "👑", "🌀", "💀", "🪖", "⛏️", "🕺", "🌌", "🪄", "🎧", "🎮", "👸", "🏆", "💎", "🎁", "🛡️"];

export default function SellPage() {
  const { user, addListing } = useApp();
  const router = useRouter();

  const [game, setGame] = useState("CS2");
  const [category, setCategory] = useState("Skin");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState("Factory New");
  const [rarity, setRarity] = useState("Rare");
  const [description, setDescription] = useState("");
  const [emoji, setEmoji] = useState("🔫");
  const [error, setError] = useState("");

  if (!user) {
    return (
      <div style={{ minHeight: "100vh", background: "#0d0d14", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, color: "#f0f0f0" }}>
        <div style={{ fontSize: 48 }}>🔒</div>
        <h2 style={{ fontSize: 22, fontWeight: 700 }}>Sign in to list an item</h2>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={() => router.push("/login")} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "#f0f0f0", padding: "10px 22px", borderRadius: 8, cursor: "pointer", fontSize: 14 }}>Log in</button>
          <button onClick={() => router.push("/signup")} style={{ background: "linear-gradient(135deg, #a855f7, #3b82f6)", color: "#fff", border: "none", padding: "10px 22px", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 700 }}>Sign up</button>
        </div>
      </div>
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !price) { setError("Name and price are required."); return; }
    if (isNaN(Number(price)) || Number(price) <= 0) { setError("Enter a valid price."); return; }

    addListing({
      game, category, name,
      price: parseFloat(Number(price).toFixed(2)),
      condition, rarity, description, emoji,
      seller: displayName(user!),
      sellerEmail: user!.email ?? "",
    });
    router.push("/");
  }

  const fieldStyle = { width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "12px 14px", color: "#f0f0f0", fontSize: 15, outline: "none", boxSizing: "border-box" as const };
  const labelStyle = { fontSize: 13, fontWeight: 600 as const, color: "#94a3b8", display: "block" as const, marginBottom: 6 };

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d14", color: "#f0f0f0" }}>
      {/* Nav */}
      <nav style={{ background: "rgba(13,13,20,0.95)", borderBottom: "1px solid rgba(255,255,255,0.08)", position: "sticky", top: 0, zIndex: 50, backdropFilter: "blur(12px)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ fontSize: 22, fontWeight: 900, background: "linear-gradient(135deg, #a855f7, #3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", textDecoration: "none" }}>VaultTrade</a>
          <span style={{ fontSize: 14, color: "#64748b" }}>Logged in as <span style={{ color: "#a855f7" }}>{displayName(user)}</span></span>
        </div>
      </nav>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "48px 24px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>List an item for sale</h1>
        <p style={{ fontSize: 14, color: "#64748b", marginBottom: 36 }}>Fill in the details below to create your listing.</p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Game + Category */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={labelStyle}>Game</label>
              <select value={game} onChange={(e) => { setGame(e.target.value); setCategory(CATEGORIES[e.target.value][0]); }} style={{ ...fieldStyle, cursor: "pointer" }}>
                {GAMES.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ ...fieldStyle, cursor: "pointer" }}>
                {(CATEGORIES[game] || CATEGORIES.Other).map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Name */}
          <div>
            <label style={labelStyle}>Item name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. AK-47 | Fire Serpent" style={fieldStyle} />
          </div>

          {/* Price + Condition */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={labelStyle}>Price (USD)</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" min="0.01" step="0.01" style={fieldStyle} />
            </div>
            <div>
              <label style={labelStyle}>Condition</label>
              <select value={condition} onChange={(e) => setCondition(e.target.value)} style={{ ...fieldStyle, cursor: "pointer" }}>
                {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Rarity */}
          <div>
            <label style={labelStyle}>Rarity</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {RARITIES.map((r) => (
                <button key={r} type="button" onClick={() => setRarity(r)}
                  style={{ padding: "8px 16px", borderRadius: 100, border: "1px solid", cursor: "pointer", fontSize: 13, fontWeight: 600, transition: "all 0.15s",
                    borderColor: rarity === r ? "#a855f7" : "rgba(255,255,255,0.12)",
                    background: rarity === r ? "rgba(168,85,247,0.2)" : "rgba(255,255,255,0.04)",
                    color: rarity === r ? "#c084fc" : "#64748b",
                  }}>
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Emoji picker */}
          <div>
            <label style={labelStyle}>Icon</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {EMOJIS.map((em) => (
                <button key={em} type="button" onClick={() => setEmoji(em)}
                  style={{ width: 44, height: 44, fontSize: 22, borderRadius: 10, border: "1px solid", cursor: "pointer", background: emoji === em ? "rgba(168,85,247,0.2)" : "rgba(255,255,255,0.04)", borderColor: emoji === em ? "#a855f7" : "rgba(255,255,255,0.1)" }}>
                  {em}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Description (optional)</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your item, condition details, trade history..." rows={4}
              style={{ ...fieldStyle, resize: "vertical" as const, fontFamily: "inherit" }} />
          </div>

          {error && <p style={{ fontSize: 13, color: "#f43f5e" }}>{error}</p>}

          <div style={{ display: "flex", gap: 12 }}>
            <button type="button" onClick={() => router.push("/")} style={{ flex: 1, background: "transparent", border: "1px solid rgba(255,255,255,0.15)", color: "#94a3b8", padding: "14px", borderRadius: 10, cursor: "pointer", fontSize: 15 }}>
              Cancel
            </button>
            <button type="submit" style={{ flex: 2, background: "linear-gradient(135deg, #a855f7, #3b82f6)", color: "#fff", border: "none", borderRadius: 10, padding: "14px", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
              Publish listing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
