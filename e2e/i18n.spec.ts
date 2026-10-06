import { expect, test } from "@playwright/test";
import { counter } from "./helpers";

/** I18N-1, I18N-2, I18N-4 */

test("I18N-1/4: / en español y /en/ en inglés, con hreflang", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute("href", /\/en\/$/);

  await page.goto("/en/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator('link[rel="alternate"][hreflang="es"]')).toHaveAttribute("href", /\/$/);
  await expect(counter(page)).toContainText("Home");
});

test("I18N-2: el selector marca el idioma activo y lleva al otro", async ({ page }) => {
  await page.goto("/");
  const lang = page.getByRole("navigation", { name: "Idioma" });
  await expect(lang.getByRole("link", { name: "ES" })).toHaveAttribute("aria-current", "true");

  await lang.getByRole("link", { name: "EN" }).click();
  await expect(page).toHaveURL(/\/en\/$/);
  const langEn = page.getByRole("navigation", { name: "Language" });
  await expect(langEn.getByRole("link", { name: "EN" })).toHaveAttribute("aria-current", "true");
});
