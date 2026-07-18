import { expect, test } from "@playwright/test";

test("sessão reutilizada acessa dashboard e perfil", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();

  await page.goto("/perfil");
  await expect(page.getByRole("heading", { name: "Meu Perfil" })).toBeVisible();
  await expect(page.locator('input[type="text"]')).toHaveValue("Usuário E2E");
});

test("logout encerra a sessão e volta ao login", async ({ page }) => {
  await page.goto("/dashboard");
  await page.getByRole("button", { name: "Sair" }).click();
  await expect(page).toHaveURL(/\/login$/);
  await page.goto("/dashboard");
  await expect(page).toHaveURL((url) => url.pathname === "/login" && url.searchParams.get("next") === "/dashboard");
});
