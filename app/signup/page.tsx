"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "../context/AppContext";

export default function SignupPage() {
  const { login } = useApp();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !password) { setError("Please fill in all fields."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    login({ name, email });
    router.push("/");
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d14", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <a href="/" style={{ fontSize: 24, fontWeight: 900, background: "linear-gradient(135deg, #a855f7, #3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", textDecoration: "none", marginBottom: 40 }}>
        VaultTrade
      </a>
      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "40px 36px", width: "100%", maxWidth: 420 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, color: "#f0f0f0" }}>Create your account</h1>
        <p style={{ fontSize: 14, color: "#64748b", marginBottom: 32 }}>Start buying and selling game assets today</p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: 6 }}>Username</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="TradeKing_EU"
              style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "12px 14px", color: "#f0f0f0", fontSize: 15, outline: "none", boxSizing: "border-box" }}
            />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: 6 }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "12px 14px", color: "#f0f0f0", fontSize: 15, outline: "none", boxSizing: "border-box" }}
            />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: 6 }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "12px 14px", color: "#f0f0f0", fontSize: 15, outline: "none", boxSizing: "border-box" }}
            />
          </div>
          {error && <p style={{ fontSize: 13, color: "#f43f5e" }}>{error}</p>}
          <button type="submit" style={{ background: "linear-gradient(135deg, #a855f7, #3b82f6)", color: "#fff", border: "none", borderRadius: 10, padding: "14px", fontWeight: 700, fontSize: 15, cursor: "pointer", marginTop: 8 }}>
            Create account
          </button>
        </form>

        <p style={{ fontSize: 13, color: "#64748b", marginTop: 24, textAlign: "center" }}>
          Already have an account?{" "}
          <a href="/login" style={{ color: "#a855f7", fontWeight: 600, textDecoration: "none" }}>Log in</a>
        </p>
      </div>
    </div>
  );
}
