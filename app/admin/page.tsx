"use client";

import { useRouter } from "next/navigation";
import { useApp } from "../context/AppContext";

export default function AdminPage() {
  const { user, profile, loading, pendingRequests, approveRequest, rejectRequest } = useApp();
  const router = useRouter();

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0d0d14", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}>
        Loading…
      </div>
    );
  }

  if (!user || !profile?.is_admin) {
    return (
      <div style={{ minHeight: "100vh", background: "#0d0d14", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, color: "#f0f0f0" }}>
        <div style={{ fontSize: 48 }}>🚫</div>
        <h2 style={{ fontSize: 22, fontWeight: 700 }}>Access denied</h2>
        <p style={{ fontSize: 14, color: "#64748b" }}>This page is for admins only.</p>
        <button onClick={() => router.push("/")} style={{ background: "linear-gradient(135deg, #a855f7, #3b82f6)", color: "#fff", border: "none", borderRadius: 8, padding: "10px 22px", cursor: "pointer", fontWeight: 700 }}>
          Back to marketplace
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d14", color: "#f0f0f0" }}>
      <nav style={{ background: "rgba(13,13,20,0.95)", borderBottom: "1px solid rgba(255,255,255,0.08)", position: "sticky", top: 0, zIndex: 50, backdropFilter: "blur(12px)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ fontSize: 22, fontWeight: 900, background: "linear-gradient(135deg, #a855f7, #3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", textDecoration: "none" }}>VaultTrade</a>
          <span style={{ fontSize: 13, background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.3)", color: "#c084fc", padding: "4px 12px", borderRadius: 100, fontWeight: 700 }}>
            Admin
          </span>
        </div>
      </nav>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 4 }}>Seller Requests</h1>
        <p style={{ fontSize: 14, color: "#64748b", marginBottom: 40 }}>
          {pendingRequests.length === 0
            ? "No pending requests."
            : `${pendingRequests.length} pending request${pendingRequests.length !== 1 ? "s" : ""}`}
        </p>

        {pendingRequests.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#64748b" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <p style={{ fontSize: 16, fontWeight: 600, color: "#94a3b8" }}>All caught up</p>
            <p style={{ fontSize: 13, marginTop: 8 }}>No seller requests waiting for review.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, #a855f7, #3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 900, color: "#fff", flexShrink: 0 }}>
                    {(req.full_name ?? req.email ?? "?").slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>
                      {req.full_name ?? "Unknown"}
                    </p>
                    <p style={{ fontSize: 13, color: "#64748b" }}>{req.email ?? req.user_id}</p>
                    <p style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>
                      Requested {new Date(req.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={() => rejectRequest(req.id)}
                    style={{ background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.3)", color: "#f43f5e", padding: "8px 18px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 }}
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => approveRequest(req.id, req.user_id)}
                    style={{ background: "linear-gradient(135deg, #a855f7, #3b82f6)", color: "#fff", border: "none", padding: "8px 18px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 700 }}
                  >
                    Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
