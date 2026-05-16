"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";

export type Listing = {
  id: string;
  game: string;
  category: string;
  name: string;
  price: number;
  rarity: string;
  condition: string;
  seller: string;
  sellerEmail: string;
  emoji: string;
  description?: string;
};

export type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  is_seller: boolean;
  is_admin: boolean;
};

export type SellerRequestStatus = "none" | "pending" | "approved" | "rejected";

export type PendingRequest = {
  id: string;
  user_id: string;
  created_at: string;
  email: string | null;
  full_name: string | null;
};

type AppContextType = {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  listings: Listing[];
  sellerRequestStatus: SellerRequestStatus;
  pendingRequests: PendingRequest[];
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  addListing: (listing: Omit<Listing, "id">) => Promise<void>;
  requestSellerAccess: () => Promise<void>;
  approveRequest: (requestId: string, userId: string) => Promise<void>;
  rejectRequest: (requestId: string) => Promise<void>;
  refreshPendingRequests: () => Promise<void>;
};

const AppContext = createContext<AppContextType | null>(null);

function mapRow(row: Record<string, unknown>): Listing {
  return {
    id: String(row.id),
    game: row.game as string,
    category: row.category as string,
    name: row.name as string,
    price: Number(row.price),
    rarity: row.rarity as string,
    condition: row.condition as string,
    description: row.description as string | undefined,
    emoji: row.emoji as string,
    seller: row.seller as string,
    sellerEmail: row.seller_email as string,
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<Listing[]>([]);
  const [sellerRequestStatus, setSellerRequestStatus] = useState<SellerRequestStatus>("none");
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);

  async function fetchListings() {
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .order("created_at", { ascending: false });
    console.log("[fetchListings] rows:", data?.length ?? 0, "error:", error?.message ?? "none", "code:", error?.code ?? "-");
    if (error) console.error("[fetchListings] full error:", error);
    if (data) setListings(data.map(mapRow));
  }

  async function fetchProfile(uid: string) {
    // ensure_profile() is SECURITY DEFINER — runs as postgres, bypasses RLS
    await supabase.rpc("ensure_profile");
    const { data } = await supabase.from("profiles").select("*").eq("id", uid).single();
    if (data) setProfile(data as Profile);
    return data as Profile | null;
  }

  async function fetchSellerRequestStatus(uid: string) {
    const { data } = await supabase
      .from("seller_requests")
      .select("status")
      .eq("user_id", uid)
      .maybeSingle();
    setSellerRequestStatus((data?.status as SellerRequestStatus) ?? "none");
  }

  async function fetchPendingRequests() {
    const { data: requests } = await supabase
      .from("seller_requests")
      .select("id, user_id, created_at")
      .eq("status", "pending")
      .order("created_at", { ascending: true });

    if (!requests || requests.length === 0) {
      setPendingRequests([]);
      return;
    }

    const userIds = requests.map((r) => r.user_id);
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, email, full_name")
      .in("id", userIds);

    const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));
    setPendingRequests(
      requests.map((r) => ({
        id: r.id,
        user_id: r.user_id,
        created_at: r.created_at,
        email: profileMap.get(r.user_id)?.email ?? null,
        full_name: profileMap.get(r.user_id)?.full_name ?? null,
      }))
    );
  }

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const u = session?.user ?? null;
      setUser(u);

      // Fetch listings on the events that change the active role
      if (event === "INITIAL_SESSION" || event === "SIGNED_IN" || event === "SIGNED_OUT") {
        fetchListings();
      }

      if (u) {
        try {
          const p = await fetchProfile(u.id);
          await fetchSellerRequestStatus(u.id);
          if (p?.is_admin) await fetchPendingRequests();
        } catch (e) {
          console.error("[AppContext] profile fetch failed", e);
        }
      } else {
        setProfile(null);
        setSellerRequestStatus("none");
        setPendingRequests([]);
      }

      if (event === "INITIAL_SESSION") setLoading(false);
    });

    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
  }

  async function signOut() {
    try {
      await supabase.auth.signOut({ scope: "local" });
    } catch {
      // ignore server errors — local session is cleared below regardless
    }
    setUser(null);
    setProfile(null);
    setSellerRequestStatus("none");
    setPendingRequests([]);
  }

  async function addListing(data: Omit<Listing, "id">) {
    const { data: row, error } = await supabase
      .from("listings")
      .insert({
        user_id: user!.id,
        game: data.game,
        category: data.category,
        name: data.name,
        price: data.price,
        rarity: data.rarity,
        condition: data.condition,
        description: data.description ?? null,
        emoji: data.emoji,
        seller: data.seller,
        seller_email: data.sellerEmail,
      })
      .select()
      .single();

    if (!error && row) {
      setListings((prev) => [mapRow(row as Record<string, unknown>), ...prev]);
    }
  }

  async function requestSellerAccess() {
    const { error } = await supabase
      .from("seller_requests")
      .insert({ user_id: user!.id });
    if (!error) setSellerRequestStatus("pending");
  }

  async function approveRequest(requestId: string, userId: string) {
    await supabase.from("seller_requests").update({ status: "approved" }).eq("id", requestId);
    await supabase.from("profiles").update({ is_seller: true }).eq("id", userId);
    setPendingRequests((prev) => prev.filter((r) => r.id !== requestId));
  }

  async function rejectRequest(requestId: string) {
    await supabase.from("seller_requests").update({ status: "rejected" }).eq("id", requestId);
    setPendingRequests((prev) => prev.filter((r) => r.id !== requestId));
  }

  return (
    <AppContext.Provider value={{
      user, profile, loading, listings,
      sellerRequestStatus, pendingRequests,
      signInWithGoogle, signOut,
      addListing, requestSellerAccess,
      approveRequest, rejectRequest,
      refreshPendingRequests: fetchPendingRequests,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

export function displayName(user: User): string {
  return user.user_metadata?.full_name ?? user.user_metadata?.name ?? user.email?.split("@")[0] ?? "User";
}
