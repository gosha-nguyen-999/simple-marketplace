"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

async function ensureProfile(userId: string, email: string | undefined, name: string | undefined) {
  const { data: existing } = await supabase.from("profiles").select("id").eq("id", userId).single();
  if (existing) return;
  await supabase.from("profiles").insert({
    id: userId,
    email: email ?? null,
    full_name: name ?? null,
  });
}

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        const u = session.user;
        await ensureProfile(u.id, u.email, u.user_metadata?.full_name ?? u.user_metadata?.name);
        router.replace("/");
      }
    });

    // Handle hash-based tokens (implicit flow fallback)
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const u = session.user;
        await ensureProfile(u.id, u.email, u.user_metadata?.full_name ?? u.user_metadata?.name);
        router.replace("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d14", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, color: "#f0f0f0" }}>
      <div style={{ fontSize: 36 }}>⚡</div>
      <p style={{ fontSize: 16, color: "#94a3b8" }}>Signing you in...</p>
    </div>
  );
}
