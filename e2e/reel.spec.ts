import { expect, test } from "@playwright/test";
import { counter, expectAligned, panelTop, panelX, reelMetrics, scrollToY } from "./helpers";

/** NAV-1…10 y A11Y-FOCUS — SPEC §2.1, §3.1, §8 */

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await expect(counter(page)).toContainText("01 / 06");
});

test("NAV-1: scroll vertical alinea cada panel en panelTop(i)", async ({ page }) => {
  await scrollToY(page, await panelTop(page, 2));
  await expectAligned(page, "stack", 2);
});

test("NAV-1: el movimiento es continuo (sin snap)", async ({ page }) => {
  const m = await reelMetrics(page);
  await scrollToY(page, m.start + (1.5 * m.range) / (m.count - 1));
  // A mitad entre el panel 2 y el 3: "sobre-mi" desplazado medio ancho a la izquierda.
  await expect.poll(() => panelX(page, "sobre-mi")).toBeCloseTo(-m.width / 2, 0);
  // Y sigue ahí: no hay snap.
  await page.waitForTimeout(400);
  expect(await panelX(page, "sobre-mi")).toBeCloseTo(-m.width / 2, 0);
});

test("NAV-2/3: → avanza y es cíclico; ← está deshabilitado en el 01", async ({ page }) => {
  const prev = page.getByRole("button", { name: "Panel anterior" });
  const next = page.getByRole("button", { name: "Panel siguiente" });
  await expect(prev).toBeDisabled();

  for (let i = 1; i < 6; i++) {
    await next.click();
    await expect(counter(page)).toContainText(`0${i + 1} / 06`);
  }
  await expectAligned(page, "contacto", 5);

  await next.click();
  await expectAligned(page, "inicio", 0);

  await next.click();
  await expect(counter(page)).toContainText("02 / 06");
  await prev.click();
  await expectAligned(page, "inicio", 0);
});

test("NAV-4/5: los puntos llevan al panel y marcan aria-current", async ({ page }) => {
  await page.getByRole("button", { name: "Ir a Experiencia" }).click();
  await expectAligned(page, "experiencia", 3);
  await expect(page.getByRole("button", { name: "Ir a Experiencia" })).toHaveAttribute(
    "aria-current",
    "step",
  );
  await expect(counter(page)).toContainText("Experiencia");
});

test("NAV-6/7: nombre del header → 01, 'Ver proyectos' → 05", async ({ page }) => {
  await page.getByRole("button", { name: "Ver proyectos" }).click();
  await expectAligned(page, "proyectos", 4);
  await page.getByRole("button", { name: /Nairelys Hernández/ }).click();
  await expectAligned(page, "inicio", 0);
});

test("NAV-8: la pista de scroll se oculta al desplazar", async ({ page }) => {
  const outer = page.locator("[data-reel-outer]");
  await expect(outer).not.toHaveAttribute("data-scrolled");
  await scrollToY(page, 200);
  await expect(outer).toHaveAttribute("data-scrolled", "");
});

test("NAV-9: con reduced motion el salto es instantáneo", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const target = await panelTop(page, 4);
  await page.getByRole("button", { name: "Ir a Proyectos" }).click();
  await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 150 }).toBeCloseTo(target, 0);
});

test("NAV-10: al redimensionar se conserva el panel", async ({ page }) => {
  await scrollToY(page, await panelTop(page, 2));
  await expectAligned(page, "stack", 2);

  const size = page.viewportSize()!;
  await page.setViewportSize({ width: size.height, height: size.width }); // rotación
  await expectAligned(page, "stack", 2);
});

test("§7: sin scroll horizontal de página ni barras desbordadas", async ({ page }) => {
  const overflow = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const bars = [...document.querySelectorAll<HTMLElement>("header, footer")].map(
      (el) => el.scrollWidth - el.clientWidth,
    );
    return { page: document.documentElement.scrollWidth - vw, bars };
  });
  expect(overflow.page).toBeLessThanOrEqual(0);
  for (const b of overflow.bars) expect(b).toBeLessThanOrEqual(0);
});

test("A11Y-FOCUS: con Tab el elemento enfocado siempre es visible", async ({ page, browserName }) => {
  // Safari solo enfoca enlaces y botones con Tab si se activa en preferencias; Alt+Tab lo hace siempre.
  const tab = browserName === "webkit" ? "Alt+Tab" : "Tab";
  const seenPanels = new Set<string>();
  for (let n = 0; n < 40; n++) {
    await page.keyboard.press(tab);
    // Dos frames: rAF del hook + pintado.
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
    const info = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el || el === document.body) return null;
      const r = el.getBoundingClientRect();
      return {
        left: r.left,
        right: r.right,
        vw: window.innerWidth,
        panel: el.closest<HTMLElement>("[data-panel]")?.id ?? null,
        panelIndex: Number(el.closest<HTMLElement>("[data-panel]")?.dataset.panel ?? -1),
      };
    });
    if (!info) continue;
    expect(info.left, "foco fuera de vista por la izquierda").toBeGreaterThanOrEqual(-1);
    expect(info.right, "foco fuera de vista por la derecha").toBeLessThanOrEqual(info.vw + 1);
    if (info.panel) {
      seenPanels.add(info.panel);
      await expect(counter(page)).toContainText(`0${info.panelIndex + 1} / 06`);
    }
  }
  // El recorrido cruza al menos del panel 01 al 06.
  expect(seenPanels).toContain("inicio");
  expect(seenPanels).toContain("contacto");
});
