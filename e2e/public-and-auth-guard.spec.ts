import { expect, test } from "@playwright/test";

test("rotas públicas essenciais carregam", async ({ page }) => {
  await page.goto("/login");
  await page.waitForLoadState("networkidle");
  await expect(page.getByRole("button", { name: "Entrar no Sistema" })).toBeVisible();
  await page.goto("/register");
  await expect(page.getByRole("button", { name: /criar/i })).toBeVisible();
  await page.goto("/reset-password");
  await expect(page.getByRole("heading", { name: "Recuperar senha" })).toBeVisible();
});

for (const route of ["/dashboard", "/clientes", "/processos", "/prazos", "/perfil"]) {
  test(`visitante é bloqueado em ${route}`, async ({ page }) => {
    await page.goto(route);
    await expect(page).toHaveURL((url) =>
      url.pathname === "/login" && url.searchParams.get("next") === route,
    );
  });
}
