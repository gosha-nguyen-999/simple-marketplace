import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  use: {
    baseURL: "https://simple-marketplace-nu.vercel.app",
    headless: true,
  },
});
