import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * Fase 4 — PLAN 4.2 (barrido de desbordes) y 4.7 (axe). SPEC §7, §8, §12-4/5.
 * Se ejecuta una sola vez (desktop-chromium) y cambia el viewport dentro del test.
 */

test.beforeEach(({}, info) => {
  test.skip(info.project.name !== "desktop-chromium", "barrido de viewports: un solo proyecto");
});

const SWEEP = [
  [320, 568],
  [375, 667],
  [390, 844],
  [768, 1024],
  [1024, 768],
  [1440, 900],
  [1920, 1080],
] as const;

for (const path of ["/", "/en/"]) {
  for (const [width, height] of SWEEP) {
    test(`4.2 ${path} ${width}×${height}: sin scroll horizontal ni paneles desbordados`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);

      const result = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        return {
          pageOverflowX: document.documentElement.scrollWidth - vw,
          bars: [...document.querySelectorAll<HTMLElement>("header, footer")].map(
            (el) => el.scrollWidth - el.clientWidth,
          ),
          // Contenido cortado: cualquier elemento visible y no decorativo que se salga del panel.
          // Las decoraciones (aria-hidden: manchas, anillo, mockups) pueden recortarse a propósito.
          panels: [...document.querySelectorAll<HTMLElement>("[data-panel]")].flatMap((p) => {
            const box = p.getBoundingClientRect();
            return [...p.querySelectorAll<HTMLElement>("*")]
              .filter((el) => !el.closest('[aria-hidden="true"]') && !el.closest(".sr-only"))
              .filter((el) => el.children.length === 0 || el.matches("a, button, img, h1, h2"))
              .map((el) => ({ el, r: el.getBoundingClientRect() }))
              .filter(({ r }) => r.width > 0 && r.height > 0)
              .filter(({ r }) => r.top < box.top - 1 || r.bottom > box.bottom + 1)
              .map(({ el, r }) => ({
                panel: p.id,
                el: `${el.tagName.toLowerCase()} "${(el.textContent ?? "").trim().slice(0, 30)}"`,
                over: Math.round(Math.max(box.top - r.top, r.bottom - box.bottom)),
              }));
          }),
        };
      });

      expect(result.pageOverflowX, "scroll horizontal de página").toBeLessThanOrEqual(0);
      for (const b of result.bars) expect(b, "header/footer desbordado").toBeLessThanOrEqual(0);
      expect(result.panels, "paneles que no caben en 100dvh").toEqual([]);

      // NAV-8: la pista de scroll no puede tapar ningún control del hero.
      const hintOverlaps = await page.evaluate(() => {
        const hint = document.querySelector<HTMLElement>("[data-scroll-hint]");
        if (!hint) return [];
        const h = hint.getBoundingClientRect();
        const text = [...hint.children].find((c) => (c as HTMLElement).offsetWidth > 0);
        const t = text?.getBoundingClientRect() ?? h;
        return [...document.querySelectorAll<HTMLElement>("#inicio a, #inicio button")]
          .map((el) => ({ el, r: el.getBoundingClientRect() }))
          .filter(({ r }) => r.left < t.right && r.right > t.left && r.top < t.bottom && r.bottom > t.top)
          .map(({ el }) => el.textContent?.trim());
      });
      expect(hintOverlaps, "la pista de scroll tapa controles").toEqual([]);
    });
  }
}

const AXE_VIEWPORTS = [
  [1440, 900],
  [390, 844],
  [375, 667],
] as const;

for (const path of ["/", "/en/"]) {
  for (const [width, height] of AXE_VIEWPORTS) {
    test(`4.7 axe ${path} ${width}×${height}: sin violaciones`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);

      const { violations } = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"])
        .analyze();

      const summary = violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        nodes: v.nodes.slice(0, 3).map((n) => n.target.join(" ")),
      }));
      expect(summary).toEqual([]);
    });
  }
}
