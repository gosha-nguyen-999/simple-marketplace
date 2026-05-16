-- ============================================================
-- VaultTrade Seed Data
-- Run in: Supabase Dashboard → SQL Editor → New query
-- Inserts sample listings using a placeholder user_id.
-- Replace the UUID below with a real user id from auth.users
-- if you want ownership; otherwise use a dummy UUID that won't
-- match any real user (deletes won't work but reads will).
-- ============================================================

do $$
declare
  dummy_uid uuid := '00000000-0000-0000-0000-000000000001';
begin

insert into public.listings
  (user_id, game, category, name, price, rarity, condition, description, emoji, seller, seller_email)
values
  -- CS2
  (dummy_uid, 'CS2', 'Knife',  'Karambit | Doppler (Phase 2)',         1250.00, 'Exotic',    'Factory New',    'Phase 2 with deep blue pattern.',          '🔪', 'VaultBot', 'seed@vaulttrade.gg'),
  (dummy_uid, 'CS2', 'Skin',   'AK-47 | Fire Serpent',                  890.00, 'Legendary', 'Field-Tested',   'Iconic Fire Serpent with low float.',      '🔫', 'VaultBot', 'seed@vaulttrade.gg'),
  (dummy_uid, 'CS2', 'Gloves', 'Sport Gloves | Pandora''s Box',         420.00, 'Epic',      'Minimal Wear',   'Clean Pandora''s Box gloves.',             '🧤', 'VaultBot', 'seed@vaulttrade.gg'),
  (dummy_uid, 'CS2', 'Skin',   'AWP | Dragon Lore',                    3200.00, 'Exotic',    'Factory New',    'Souvenir Dragon Lore, one of a kind.',     '🎯', 'VaultBot', 'seed@vaulttrade.gg'),
  (dummy_uid, 'CS2', 'Skin',   'M4A4 | Howl',                          2100.00, 'Exotic',    'Minimal Wear',   'Contraband M4A4 Howl, low float.',         '🔫', 'VaultBot', 'seed@vaulttrade.gg'),
  (dummy_uid, 'CS2', 'Knife',  'Butterfly Knife | Fade',                780.00, 'Legendary', 'Factory New',    '100% fade pattern, stunning colors.',      '🔪', 'VaultBot', 'seed@vaulttrade.gg'),
  (dummy_uid, 'CS2', 'Case',   'CS2 Revolution Case (x10)',               4.50, 'Common',    'Unused',         'Bundle of 10 sealed Revolution Cases.',   '🎁', 'VaultBot', 'seed@vaulttrade.gg'),

  -- Valorant
  (dummy_uid, 'Valorant', 'Bundle',   'Reaver Collection',              85.00, 'Legendary', 'Unused',         'Full Reaver bundle, never equipped.',      '👑', 'VaultBot', 'seed@vaulttrade.gg'),
  (dummy_uid, 'Valorant', 'Gun Skin', 'Elderflame Vandal',              35.00, 'Epic',      'Unused',         'Animated dragon skin, level 5.',           '⚡', 'VaultBot', 'seed@vaulttrade.gg'),
  (dummy_uid, 'Valorant', 'Bundle',   'Glitchpop Bundle',               70.00, 'Legendary', 'Unused',         'Complete Glitchpop set.',                  '🌀', 'VaultBot', 'seed@vaulttrade.gg'),
  (dummy_uid, 'Valorant', 'Gun Skin', 'Prime Vandal',                   22.00, 'Rare',      'Unused',         'Classic Prime Vandal, account-bound.',     '🔫', 'VaultBot', 'seed@vaulttrade.gg'),
  (dummy_uid, 'Valorant', 'Agent',    'Neon Agent + Prime Bundle',      55.00, 'Epic',      'Account-Bound',  'Account with Neon unlocked + Prime set.',  '⚡', 'VaultBot', 'seed@vaulttrade.gg'),

  -- Fortnite
  (dummy_uid, 'Fortnite', 'Outfit',   'Renegade Raider',               350.00, 'Legendary', 'Unused',         'OG Season 1 Renegade Raider outfit.',      '🪖', 'VaultBot', 'seed@vaulttrade.gg'),
  (dummy_uid, 'Fortnite', 'Outfit',   'Galaxy Skin',                   180.00, 'Legendary', 'Unused',         'Exclusive Samsung Galaxy skin.',           '🌌', 'VaultBot', 'seed@vaulttrade.gg'),
  (dummy_uid, 'Fortnite', 'Pickaxe',  'Raider''s Revenge',              90.00, 'Epic',      'Unused',         'Matching pickaxe for Renegade Raider.',    '⛏️', 'VaultBot', 'seed@vaulttrade.gg'),
  (dummy_uid, 'Fortnite', 'Emote',    'Orange Justice',                 75.00, 'Rare',      'Unused',         'The legendary Orange Justice emote.',      '🕺', 'VaultBot', 'seed@vaulttrade.gg'),
  (dummy_uid, 'Fortnite', 'V-Bucks',  '13,500 V-Bucks Code',            80.00, 'Common',    'Unused',         'Unused V-Bucks gift card code.',           '🎮', 'VaultBot', 'seed@vaulttrade.gg'),

  -- Roblox
  (dummy_uid, 'Roblox', 'Limited',    'Dominus Empyreus',             4200.00, 'Exotic',    'Tradeable',      'Ultra-rare Dominus, one of 10 made.',      '👸', 'VaultBot', 'seed@vaulttrade.gg'),
  (dummy_uid, 'Roblox', 'Limited',    'Valkyrie Helm',                 320.00, 'Legendary', 'Tradeable',      'Classic Valkyrie Helm from 2009.',         '🏆', 'VaultBot', 'seed@vaulttrade.gg'),
  (dummy_uid, 'Roblox', 'Accessory',  'Clockwork Headphones',           28.00, 'Rare',      'Tradeable',      'Limited clockwork headphones.',            '🎧', 'VaultBot', 'seed@vaulttrade.gg'),
  (dummy_uid, 'Roblox', 'Game Pass',  'Adopt Me Premium (3-month)',     15.00, 'Common',    'Unused',         '3-month premium pass for Adopt Me.',       '🎁', 'VaultBot', 'seed@vaulttrade.gg');

end $$;
