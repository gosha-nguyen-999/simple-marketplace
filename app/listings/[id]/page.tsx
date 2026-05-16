"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useApp, displayName } from "../../context/AppContext";
import { supabase } from "../../../lib/supabase";
import type { Listing } from "../../context/AppContext";

const RARITY_ACCENT: Record<string, string> = {
  Common: "#94a3b8", Uncommon: "#22c55e", Rare: "#3b82f6",
  Epic: "#a855f7", Legendary: "#eab308", Exotic: "#f43f5e",
};

export default function ListingPage() {
  const { user, profile, sellerRequestStatus, signOut, listings } = useApp();
  const router = useRouter();
  const params = useParams();
  const [showEmail, setShowEmail] = useState(false);
  const [listing, setListing] = useState<Listing | null>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const id = params.id as string;
    if (!id) { setFetching(false); return; }

    // If the listing is already in context (navigated from home), use it immediately.
    const cached = listings.find((l) => l.id === id);
    if (cached) { setListing(cached); setFetching(false); return; }

    // Direct URL access: fetch from Supabase.
    let cancelled = false;
    supabase
      .from("listings")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        if (cancelled) return;
        if (data) {
          setListing({
            id: String(data.id),
            game: data.game,
            category: data.category,
            name: data.name,
            price: Number(data.price),
            rarity: data.rarity,
            condition: data.condition,
            description: data.description ?? undefined,
            emoji: data.emoji,
            seller: data.seller,
            sellerEmail: data.seller_email,
          });
        }
        setFetching(false);
      })
      .catch(() => { if (!cancelled) setFetching(false); });

    return () => { cancelled = true; };
  }, [params.id, listings]);

  if (fetching) {
    return (
      <div style={{ minHeight: "100vh", background: "#0d0d14", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}>
        Loading…
      </div>
    );
  }

  if (!listing) {
    return (
      <div style={{ minHeight: "100vh", background: "#0d0d14", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, color: "#f0f0f0" }}>
        <div style={{ fontSize: 48 }}>🔍</div>
        <h2 style={{ fontSize: 22, fontWeight: 700 }}>Listing not found</h2>
        <button onClick={() => router.push("/")} style={{ background: "linear-gradient(135deg, #a855f7, #3b82f6)", color: "#fff", border: "none", borderRadius: 8, padding: "10px 22px", cursor: "pointer", fontWeight: 700 }}>Back to marketplace</button>
      </div>
    );
  }

  const accent = RARITY_ACCENT[listing.rarity] ?? "#94a3b8";

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d14", color: "#f0f0f0" }}>
      {/* Nav */}
      <nav style={{ background: "rgba(13,13,20,0.95)", borderBottom: "1px solid rgba(255,255,255,0.08)", position: "sticky", top: 0, zIndex: 50, backdropFilter: "blur(12px)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <span style={{ fontSize: 22, fontWeight: 900, background: "linear-gradient(135deg, #a855f7, #3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>VaultTrade</span>
            <span style={{ fontSize: 11, background: "#a855f7", color: "#fff", borderRadius: 4, padding: "2px 6px", fontWeight: 700, letterSpacing: "0.05em" }}>BETA</span>
          </Link>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {user ? (
              <>
                {profile !== null && (
                  profile.is_seller ? (
                    <button onClick={() => router.push("/sell")} style={{ background: "linear-gradient(135deg, #a855f7, #3b82f6)", color: "#fff", padding: "8px 18px", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 700, border: "none" }}>
                      + Sell
                    </button>
                  ) : sellerRequestStatus === "pending" ? (
                    <span style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.3)", color: "#c084fc", padding: "8px 18px", borderRadius: 8, fontSize: 14, fontWeight: 500 }}>
                      ⏳ Approval pending
                    </span>
                  ) : (
                    <button onClick={() => router.push("/sell")} style={{ background: "transparent", border: "1px solid rgba(168,85,247,0.4)", color: "#c084fc", padding: "8px 18px", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 500 }}>
                      Become a seller
                    </button>
                  )
                )}
                {profile?.is_admin && (
                  <button onClick={() => router.push("/admin")} style={{ background: "transparent", border: "1px solid rgba(168,85,247,0.3)", color: "#a855f7", padding: "8px 18px", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
                    Admin
                  </button>
                )}
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

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "48px 24px" }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: 13, color: "#64748b", marginBottom: 32, display: "flex", gap: 8, alignItems: "center" }}>
          <Link href="/" style={{ color: "#64748b", textDecoration: "none" }}>Marketplace</Link>
          <span>›</span>
          <span style={{ color: "#94a3b8" }}>{listing.name}</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "start" }}>
          {/* Left: image + details */}
          <div>
            <div style={{ background: "linear-gradient(135deg, rgba(168,85,247,0.15), rgba(59,130,246,0.15))", border: `1px solid ${accent}33`, borderRadius: 20, height: 320, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 120, marginBottom: 24, position: "relative" }}>
              {listing.emoji}
              <span style={{ position: "absolute", top: 16, right: 16, fontSize: 13, fontWeight: 700, padding: "4px 12px", borderRadius: 8, background: "rgba(0,0,0,0.7)", color: accent, border: `1px solid ${accent}55` }}>
                {listing.rarity}
              </span>
            </div>

            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                ["Game", listing.game],
                ["Category", listing.category],
                ["Condition", listing.condition],
                ["Rarity", listing.rarity],
              ].map(([label, value]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, color: "#64748b" }}>{label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8" }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: info + buy */}
          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 6, background: "rgba(255,255,255,0.08)", color: "#94a3b8" }}>{listing.game}</span>
              <span style={{ fontSize: 12, color: "#64748b", padding: "3px 10px" }}>{listing.category}</span>
            </div>
            <h1 style={{ fontSize: 30, fontWeight: 900, lineHeight: 1.2, marginBottom: 8 }}>{listing.name}</h1>
            <p style={{ fontSize: 14, color: "#64748b", marginBottom: 28 }}>{listing.condition}</p>

            <div style={{ fontSize: 40, fontWeight: 900, marginBottom: 28, background: "linear-gradient(135deg, #f0f0f0, #94a3b8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              ${listing.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>

            <button style={{ width: "100%", background: "linear-gradient(135deg, #a855f7, #3b82f6)", color: "#fff", border: "none", borderRadius: 12, padding: "16px", fontWeight: 700, fontSize: 16, cursor: "pointer", marginBottom: 12 }}>
              Buy Now
            </button>

            {/* Contact seller */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "16px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: showEmail ? 12 : 0 }}>
                <div>
                  <p style={{ fontSize: 13, color: "#64748b", marginBottom: 2 }}>Sold by</p>
                  <Link href={`/sellers/${encodeURIComponent(listing.seller)}`} style={{ fontSize: 15, fontWeight: 700, color: "#a855f7", textDecoration: "none" }}>{listing.seller}</Link>
                </div>
                <button
                  onClick={() => {
                    if (!user) { router.push("/login"); return; }
                    setShowEmail(true);
                  }}
                  style={{ background: showEmail ? "rgba(255,255,255,0.06)" : "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.3)", color: showEmail ? "#64748b" : "#c084fc", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 }}
                >
                  {showEmail ? "Email revealed" : "Contact seller"}
                </button>
              </div>
              {showEmail && (
                <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.2)", borderRadius: 8, padding: "10px 14px" }}>
                  <span style={{ fontSize: 16 }}>✉️</span>
                  <a href={`mailto:${listing.sellerEmail}`} style={{ fontSize: 14, color: "#c084fc", textDecoration: "none", fontWeight: 600 }}>{listing.sellerEmail}</a>
                </div>
              )}
              {!user && !showEmail && (
                <p style={{ fontSize: 12, color: "#475569", marginTop: 8 }}>Log in to reveal seller contact</p>
              )}
            </div>

            {listing.description && (
              <div style={{ marginTop: 24 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#94a3b8", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>Description</h3>
                <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7 }}>{listing.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
