"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";

export type Listing = {
  id: number;
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

const INITIAL_LISTINGS: Listing[] = [
  { id: 1, game: "CS2", category: "Knife", name: "Karambit | Fade", price: 1249.99, rarity: "Exotic", condition: "Factory New", seller: "TradeKing_EU", sellerEmail: "tradeking@vault.trade", emoji: "🔪", description: "One of the most sought-after knives in CS2. Stunning fade pattern with full fade on the blade." },
  { id: 2, game: "CS2", category: "Skin", name: "AK-47 | Fire Serpent", price: 389.50, rarity: "Legendary", condition: "Field-Tested", seller: "SkinVault_Pro", sellerEmail: "skinvault@vault.trade", emoji: "🔫", description: "Iconic AK-47 skin with the legendary Fire Serpent pattern. Field-tested with minimal visible wear." },
  { id: 3, game: "CS2", category: "Gloves", name: "Sport Gloves | Pandora's Box", price: 874.00, rarity: "Epic", condition: "Minimal Wear", seller: "GloveGod", sellerEmail: "glovegod@vault.trade", emoji: "🧤", description: "Premium sport gloves with the rare Pandora's Box pattern. Near mint condition." },
  { id: 4, game: "CS2", category: "Skin", name: "AWP | Dragon Lore", price: 2100.00, rarity: "Exotic", condition: "Well-Worn", seller: "LegendaryDrops", sellerEmail: "legendary@vault.trade", emoji: "🎯", description: "The holy grail of AWP skins. Dragon Lore with well-worn finish — still shows the iconic dragon." },
  { id: 5, game: "Valorant", category: "Gun Skin", name: "Reaver Vandal", price: 24.99, rarity: "Rare", condition: "Unused", seller: "ValorantVault", sellerEmail: "vavault@vault.trade", emoji: "⚡", description: "Reaver Vandal from the Reaver 2.0 collection. Includes custom animations and sound effects." },
  { id: 6, game: "Valorant", category: "Bundle", name: "Prime 2.0 Collection", price: 67.00, rarity: "Epic", condition: "Unused", seller: "AgentZero", sellerEmail: "agentzero@vault.trade", emoji: "👑", description: "Full Prime 2.0 bundle including all weapon skins. Account transfer included." },
  { id: 7, game: "Valorant", category: "Gun Skin", name: "Glitchpop Phantom", price: 19.50, rarity: "Rare", condition: "Unused", seller: "NeonRifle_VA", sellerEmail: "neonrifle@vault.trade", emoji: "🌀", description: "Cyberpunk-themed Phantom skin with animated glitch effects and custom finisher." },
  { id: 8, game: "Valorant", category: "Gun Skin", name: "Ruination Operator", price: 31.00, rarity: "Epic", condition: "Unused", seller: "DarkRealmGG", sellerEmail: "darkrealm@vault.trade", emoji: "💀", description: "From the Ruination collection. Dark, eerie aesthetic with haunting animations." },
  { id: 9, game: "Fortnite", category: "Outfit", name: "Renegade Raider", price: 145.00, rarity: "Legendary", condition: "Account-Bound", seller: "OGSkins_FN", sellerEmail: "ogskins@vault.trade", emoji: "🪖", description: "Season 1 OG skin — one of the rarest outfits in Fortnite. Full account with skin included." },
  { id: 10, game: "Fortnite", category: "Pickaxe", name: "AC/DC Pickaxe", price: 55.00, rarity: "Rare", condition: "Account-Bound", seller: "FortKing99", sellerEmail: "fortking@vault.trade", emoji: "⛏️", description: "The AC/DC pickaxe from Chapter 1. Rarely seen in lobbies today." },
  { id: 11, game: "Fortnite", category: "Emote", name: "Orange Justice", price: 89.99, rarity: "Epic", condition: "Account-Bound", seller: "DanceMaster_FN", sellerEmail: "dancemaster@vault.trade", emoji: "🕺", description: "The iconic Orange Justice emote from Season 4. A true piece of Fortnite history." },
  { id: 12, game: "Fortnite", category: "Outfit", name: "Galaxy Scout", price: 210.00, rarity: "Legendary", condition: "Account-Bound", seller: "GalaxyDrops", sellerEmail: "galaxy@vault.trade", emoji: "🌌", description: "Samsung exclusive Galaxy Scout skin. Extremely rare — only available through Samsung promotion." },
  { id: 13, game: "Roblox", category: "Limited", name: "Valkyrie Helm", price: 312.00, rarity: "Legendary", condition: "Tradeable", seller: "RobloxRoyal", sellerEmail: "robloxroyal@vault.trade", emoji: "🪄", description: "Classic Roblox limited item. The Valkyrie Helm is a must-have for any serious collector." },
  { id: 14, game: "Roblox", category: "Accessory", name: "Clockwork's Headphones", price: 44.00, rarity: "Uncommon", condition: "Tradeable", seller: "LimitedLoot_RBX", sellerEmail: "limitedloot@vault.trade", emoji: "🎧", description: "Retro headphones accessory from Clockwork's collection. Great addition to any avatar." },
  { id: 15, game: "Roblox", category: "Game Pass", name: "Bloxburg Premium Pack", price: 12.00, rarity: "Common", condition: "Transferable", seller: "PassMaster_RBX", sellerEmail: "passmaster@vault.trade", emoji: "🎮", description: "Bloxburg premium game pass. Unlock all premium features instantly." },
  { id: 16, game: "Roblox", category: "Limited", name: "Domino Crown", price: 1850.00, rarity: "Exotic", condition: "Tradeable", seller: "CrownKing_RBX", sellerEmail: "crownking@vault.trade", emoji: "👸", description: "The legendary Domino Crown — one of the rarest and most valuable items in all of Roblox." },
];

type AppContextType = {
  user: User | null;
  loading: boolean;
  listings: Listing[];
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  addListing: (listing: Omit<Listing, "id">) => void;
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<Listing[]>(INITIAL_LISTINGS);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    const storedListings = localStorage.getItem("vt_listings");
    if (storedListings) {
      const extra = JSON.parse(storedListings) as Listing[];
      setListings([...INITIAL_LISTINGS, ...extra]);
    }

    return () => subscription.unsubscribe();
  }, []);

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
  }

  function addListing(data: Omit<Listing, "id">) {
    const newListing: Listing = { ...data, id: Date.now() };
    setListings((prev) => {
      const updated = [newListing, ...prev];
      const userAdded = updated.filter((l) => !INITIAL_LISTINGS.find((i) => i.id === l.id));
      localStorage.setItem("vt_listings", JSON.stringify(userAdded));
      return updated;
    });
  }

  return (
    <AppContext.Provider value={{ user, loading, listings, signInWithGoogle, signOut, addListing }}>
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
