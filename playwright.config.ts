import { defineConfig, devices } from "@playwright/test";
import { existsSync, readFileSync } from "node:fs";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!match) continue;
    const [, name, rawValue] = match;
    if (name && process.env[name] === undefined) {
      process.env[name] = rawValue?.trim().replace(/^['"]|['"]$/g, "");
    }
  }
}

const hasAdminCredentials = Boolean(
  process.env.E2E_AUTH_ENABLED !== "false"
  &&
  process.env.NEXT_PUBLIC_SUPABASE_URL
  && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  && process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const projects = [
  { name: "chromium-public", testMatch: /public-and-auth-guard\.spec\.ts/, use: { ...devices["Desktop Chrome"] } },
  ...(hasAdminCredentials ? [
    { name: "auth-setup", testMatch: /auth\.setup\.ts/, teardown: "auth-cleanup" },
    { name: "chromium-authenticated", testMatch: /authenticated\.spec\.ts/, dependencies: ["auth-setup"], use: { ...devices["Desktop Chrome"], storageState: ".playwright/auth.json" } },
    { name: "auth-cleanup", testMatch: /auth\.teardown\.ts/ },
  ] : []),
];

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  workers: process.env.CI ? 2 : 3,
  timeout: 45_000,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: { baseURL: "http://127.0.0.1:3000", trace: "on-first-retry" },
  projects,
  webServer: { command: "npm start", url: "http://127.0.0.1:3000/login", reuseExistingServer: !process.env.CI, timeout: 120_000 },
});
