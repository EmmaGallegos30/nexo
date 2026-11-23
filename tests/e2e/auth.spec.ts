import { expect, test } from "@playwright/test";

test("access is public and does not invent a configured provider", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/acceso");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Tu siguiente paso empieza aquí.",
    }),
  ).toBeVisible();
  await expect(page.getByRole("status")).toContainText(
    "El acceso aún no está configurado.",
  );
  await expect(
    page.getByRole("button", { name: "Continuar por correo" }),
  ).toHaveCount(0);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
});

for (const route of [
  "/",
  "/semana",
  "/universidad",
  "/estudio",
  "/finanzas",
  "/cuenta",
]) {
  test(`${route} cannot render a workspace without authentication`, async ({
    page,
  }) => {
    const response = await page.goto(route);
    await expect(page).toHaveURL(/\/acceso(?:\?|$)/);
    await expect(
      page.getByRole("navigation", { name: "Navegación principal" }),
    ).toHaveCount(0);
    expect(response?.headers()["cache-control"]).toContain("no-store");
  });
}

test("a callback without a valid exchange returns a safe error, never an external redirect", async ({
  page,
}) => {
  await page.goto("/auth/callback?next=https://evil.test&code=invalid");
  await expect(page).toHaveURL(/\/acceso\?estado=enlace-invalido$/);
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "El enlace no es válido",
  );
});

test("unknown pages return 404 and the way back remains protected", async ({
  page,
}) => {
  const response = await page.goto("/pagina-inexistente");
  expect(response?.status()).toBe(404);
  await page.getByRole("link", { name: "Volver a Hoy" }).click();
  await expect(page).toHaveURL(/\/acceso$/);
});
