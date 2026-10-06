import { expect, type Page } from "@playwright/test";

export interface ReelMetrics {
  start: number;
  range: number;
  count: number;
  width: number;
}

/** Mide el carrete igual que useStickyScroll (SPEC §2.1). */
export function reelMetrics(page: Page): Promise<ReelMetrics> {
  return page.evaluate(() => {
    const outer = document.querySelector<HTMLElement>("[data-reel-outer]")!;
    const sticky = document.querySelector<HTMLElement>("[data-reel-sticky]")!;
    return {
      start: outer.getBoundingClientRect().top + window.scrollY,
      range: outer.offsetHeight - sticky.offsetHeight,
      count: document.querySelectorAll("[data-panel]").length,
      width: sticky.clientWidth,
    };
  });
}

/** panelTop(i) de SPEC §2.1 */
export async function panelTop(page: Page, i: number): Promise<number> {
  const m = await reelMetrics(page);
  return m.start + (i * m.range) / (m.count - 1);
}

export async function scrollToY(page: Page, y: number) {
  await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
}

export const counter = (page: Page) => page.locator("[data-reel-counter]");

/** Posición horizontal del panel respecto al viewport (0 = alineado). */
export function panelX(page: Page, id: string): Promise<number> {
  return page.evaluate((pid) => document.getElementById(pid)!.getBoundingClientRect().left, id);
}

/** Espera a que el panel quede alineado (±1px) y el contador lo refleje. */
export async function expectAligned(page: Page, id: string, index: number) {
  await expect.poll(() => panelX(page, id), { timeout: 10_000 }).toBeCloseTo(0, 0);
  await expect(counter(page)).toContainText(`0${index + 1} / 06`);
}
