import { expect, test } from "@playwright/test";
import { panelTop, scrollToY } from "./helpers";

/** PRJ-1…10, SPEC §3.6–3.7 */

const AUTOPLAY_SUITE = "PRJ-7…10 recorrido automático";

// Selección manual: con reduced motion el recorrido no arranca y los tests son deterministas.
test.beforeEach(async ({ page }, info) => {
  if (info.titlePath.includes(AUTOPLAY_SUITE)) return;
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await scrollToY(page, await panelTop(page, 4));
});

test("PRJ-1/2/3: seleccionar un proyecto cambia estado, eyebrow y descripción", async ({ page }) => {
  const list = page.getByRole("list", { name: "Proyectos" });
  const first = list.getByRole("button", { name: /Tu voz, tu cuento/ });
  const vetsi = list.getByRole("button", { name: /Vetsi/ });

  await expect(first).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#proyectos-title")).toHaveText("Proyectos · 01 / 05");

  await vetsi.click();
  await expect(vetsi).toHaveAttribute("aria-pressed", "true");
  await expect(first).toHaveAttribute("aria-pressed", "false");
  await expect(page.locator("#proyectos-title")).toHaveText("Proyectos · 02 / 05");
  await expect(page.locator("#proyectos")).toContainText("Atención médica primaria para mascotas");
});

test("PRJ-6: con captura se muestra la imagen; sin ella, el mockup decorativo", async ({ page }) => {
  const panel = page.locator("#proyectos");
  // 01 · captura vertical en marco de teléfono
  await expect(panel.getByRole("img", { name: /Pantalla de inicio de Tu voz, tu cuento/ })).toBeVisible();
  // 02 · collage que llena el cuadrado
  await panel.getByRole("button", { name: /Vetsi/ }).click();
  await expect(panel.getByRole("img", { name: "Collage de interfaces de Vetsi" })).toBeVisible();
  await panel.getByRole("button", { name: /Glik/ }).click();
  await expect(panel.getByRole("img")).toHaveCount(0);
});

test("P2: ningún placeholder [STACK] u otro [..] visible en el sitio", async ({ page }) => {
  for (const path of ["/", "/en/"]) {
    await page.goto(path);
    const text = await page.locator("body").innerText();
    expect(text).not.toMatch(/\[[A-ZÁÉÍÓÚÑ ]+\]/);
  }
});

test("§3.7 / §4: enlaces de contacto (WhatsApp, GitHub, LinkedIn)", async ({ page }) => {
  const contact = page.locator("#contacto");
  await expect(contact.getByRole("link", { name: /WhatsApp/ })).toHaveAttribute(
    "href",
    "https://wa.me/584242704561",
  );
  await expect(contact.getByRole("link", { name: "GitHub" })).toHaveAttribute(
    "href",
    "https://github.com/nairelyshz",
  );
  await expect(contact.getByRole("link", { name: "LinkedIn" })).toBeVisible();
});

test("PRJ-7: cambiar de proyecto no desplaza la lista (sin saltos de layout)", async ({ page }) => {
  const list = page.locator("#proyectos ul").first();
  const ys: number[] = [];
  for (const name of ["Tu voz", "Vetsi", "Wobber", "Glik", "Libre"]) {
    await page.locator("#proyectos").getByRole("button", { name: new RegExp(name) }).click();
    ys.push(Math.round((await list.boundingBox())!.y));
  }
  expect(new Set(ys).size).toBe(1);
});

test.describe(AUTOPLAY_SUITE, () => {
  const pressed = (page: import("@playwright/test").Page) =>
    page.locator('#proyectos button[aria-pressed="true"]');

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Cursor lejos del panel: el hover pausa el recorrido (PRJ-8).
    await page.mouse.move(1, 1);
  });

  test("PRJ-7: con el panel en pantalla avanza solo al siguiente proyecto", async ({ page }) => {
    await scrollToY(page, await panelTop(page, 4));
    await expect(pressed(page)).toContainText("Tu voz, tu cuento");
    await expect(pressed(page)).toContainText("Vetsi", { timeout: 8000 });
    await expect(page.locator("#proyectos-title")).toHaveText("Proyectos · 02 / 05");
    // Y sigue: ~2 s después, el 03.
    await expect(pressed(page)).toContainText("Wobber", { timeout: 8000 });
  });

  test("PRJ-8: no avanza mientras el panel no está en pantalla", async ({ page }) => {
    await page.waitForTimeout(6000);
    await scrollToY(page, await panelTop(page, 4));
    await expect(pressed(page)).toContainText("Tu voz, tu cuento");
  });

  test("PRJ-8: el cursor sobre el panel pausa el recorrido", async ({ page }) => {
    await scrollToY(page, await panelTop(page, 4));
    await page.locator("#proyectos h2").hover();
    await page.waitForTimeout(6000);
    await expect(pressed(page)).toContainText("Tu voz, tu cuento");
  });

  test("PRJ-9: el botón pausa y reanuda; elegir un proyecto detiene el recorrido", async ({ page }) => {
    await scrollToY(page, await panelTop(page, 4));
    const pause = page.getByRole("button", { name: "Pausar recorrido" });
    await pause.click();
    await expect(page.getByRole("button", { name: "Reanudar recorrido" })).toBeVisible();

    // Reanudar con el cursor (y el foco) todavía sobre el botón arranca de inmediato.
    await page.getByRole("button", { name: "Reanudar recorrido" }).click();
    await expect(pressed(page)).toContainText("Vetsi", { timeout: 8000 });

    await page.locator("#proyectos").getByRole("button", { name: /Glik/ }).click();
    await page.mouse.move(1, 1);
    await expect(page.getByRole("button", { name: "Reanudar recorrido" })).toBeVisible();
    await page.waitForTimeout(6000);
    await expect(pressed(page)).toContainText("Glik");
  });

  test("PRJ-10: con reduced motion empieza en pausa", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await scrollToY(page, await panelTop(page, 4));
    await expect(page.getByRole("button", { name: "Reanudar recorrido" })).toBeVisible();
    await page.waitForTimeout(6000);
    await expect(pressed(page)).toContainText("Tu voz, tu cuento");
  });
});

test("§7: ningún panel desborda su alto (sin scroll interno ni contenido cortado)", async ({ page }) => {
  const overflows = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>("[data-panel]")]
      .map((p) => ({ id: p.id, extra: p.scrollHeight - p.clientHeight }))
      .filter((p) => p.extra > 1),
  );
  expect(overflows).toEqual([]);
});
