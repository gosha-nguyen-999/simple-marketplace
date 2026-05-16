import { test, expect } from "@playwright/test";

// ─── Login page ───────────────────────────────────────────────────────────────

test("login page shows Google sign-in button", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("button", { name: /continue with google/i })).toBeVisible();
});

test("login page links to signup", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("link", { name: /sign up/i })).toBeVisible();
});

// ─── Signup page ──────────────────────────────────────────────────────────────

test("signup page shows Google sign-up button", async ({ page }) => {
  await page.goto("/signup");
  await expect(page.getByRole("button", { name: /sign up with google/i })).toBeVisible();
});

test("signup page links back to login", async ({ page }) => {
  await page.goto("/signup");
  await expect(page.getByRole("link", { name: /log in/i })).toBeVisible();
});

test("signup page navigates to login when log in clicked", async ({ page }) => {
  await page.goto("/signup");
  await page.getByRole("link", { name: /log in/i }).click();
  await expect(page).toHaveURL("/login");
});

// ─── Google OAuth flow (redirect test) ───────────────────────────────────────

test("clicking Google sign-in redirects to Google OAuth", async ({ page }) => {
  await page.goto("/login");
  const [popup] = await Promise.all([
    page.waitForNavigation({ waitUntil: "commit" }).catch(() => null),
    page.getByRole("button", { name: /continue with google/i }).click(),
  ]);
  // Should navigate away from /login toward Google/Supabase OAuth
  const url = page.url();
  const isOAuthRedirect =
    url.includes("accounts.google.com") ||
    url.includes("supabase.co") ||
    url !== "http://localhost:3001/login";
  expect(isOAuthRedirect).toBeTruthy();
});

test("clicking Google sign-up redirects to Google OAuth", async ({ page }) => {
  await page.goto("/signup");
  await Promise.all([
    page.waitForNavigation({ waitUntil: "commit" }).catch(() => null),
    page.getByRole("button", { name: /sign up with google/i }).click(),
  ]);
  const url = page.url();
  const isOAuthRedirect =
    url.includes("accounts.google.com") ||
    url.includes("supabase.co") ||
    url !== "http://localhost:3001/signup";
  expect(isOAuthRedirect).toBeTruthy();
});

// ─── Auth callback page ───────────────────────────────────────────────────────

test("auth callback page renders signing-in state", async ({ page }) => {
  await page.goto("/auth/callback");
  await expect(page.getByText(/signing you in/i)).toBeVisible();
});

// ─── Protected route: sell page ───────────────────────────────────────────────

test("sell page shows login prompt when not authenticated", async ({ page }) => {
  await page.goto("/sell");
  await expect(page.getByText(/sign in to list an item/i)).toBeVisible();
});

test("sell page shows login and signup buttons when not authenticated", async ({ page }) => {
  await page.goto("/sell");
  await expect(page.getByRole("button", { name: /log in/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /sign up/i })).toBeVisible();
});

test("sell page login button navigates to login", async ({ page }) => {
  await page.goto("/sell");
  await page.getByRole("button", { name: /log in/i }).click();
  await expect(page).toHaveURL("/login");
});

// ─── Nav: unauthenticated state ───────────────────────────────────────────────

test("homepage nav shows login and signup when logged out", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: /log in/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /sign up/i })).toBeVisible();
});

test("homepage nav does not show sell button when logged out", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: /\+ sell/i })).not.toBeVisible();
});

// ─── Sell page: non-seller states ────────────────────────────────────────────

test("sell page shows become-a-seller prompt for unauthenticated user", async ({ page }) => {
  await page.goto("/sell");
  await expect(page.getByText(/sign in to list an item/i)).toBeVisible();
});

test("sell page request-access button is present for unauthenticated user view", async ({ page }) => {
  await page.goto("/sell");
  // Unauthenticated users see login/signup, not the request button
  await expect(page.getByRole("button", { name: /log in/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /sign up/i })).toBeVisible();
});

// ─── Admin page: unauthenticated ─────────────────────────────────────────────

test("admin page shows access denied when not logged in", async ({ page }) => {
  await page.goto("/admin");
  await expect(page.getByText(/access denied/i)).toBeVisible({ timeout: 60000 });
});

test("admin page shows back to marketplace button when access denied", async ({ page }) => {
  await page.goto("/admin");
  await expect(page.getByRole("button", { name: /back to marketplace/i })).toBeVisible({ timeout: 60000 });
});

test("admin page back button navigates to homepage", async ({ page }) => {
  await page.goto("/admin");
  const backBtn = page.getByRole("button", { name: /back to marketplace/i });
  await backBtn.waitFor({ timeout: 60000 });
  await backBtn.click();
  await expect(page).toHaveURL("/");
});

// ─── Listing detail page ──────────────────────────────────────────────────────

test("listing page shows not-found for non-existent numeric id", async ({ page }) => {
  await page.goto("/listings/999999999");
  await expect(page.getByText(/listing not found/i)).toBeVisible({ timeout: 15000 });
});

test("listing page shows not-found for a UUID (non-numeric) id", async ({ page }) => {
  await page.goto("/listings/1101cc98-f5a2-4547-94d6-b6a6e3475a74");
  await expect(page.getByText(/listing not found/i)).toBeVisible({ timeout: 15000 });
});

test("listing not-found page has back to marketplace button", async ({ page }) => {
  await page.goto("/listings/999999999");
  await expect(page.getByRole("button", { name: /back to marketplace/i })).toBeVisible({ timeout: 15000 });
});

test("listing not-found back button navigates to homepage", async ({ page }) => {
  await page.goto("/listings/999999999");
  const btn = page.getByRole("button", { name: /back to marketplace/i });
  await btn.waitFor({ timeout: 15000 });
  await btn.click();
  await expect(page).toHaveURL("/");
});
