import { defineConfig, devices } from "@playwright/test";

const PORT = 4173;

/**
 * E2E contra el export estático real (out/), no contra `next dev`.
 * Viewports de SPEC §12: escritorio 1440×900 y móvil 390×844, en Chromium y WebKit.
 */
export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  // Los tests del recorrido (PRJ-7…10) dependen del reloj; con muchos navegadores en paralelo
  // en una máquina cargada las animaciones se congelan y fallan sin motivo real.
  workers: process.env.CI ? 2 : 3,
  // Scroll suave + recorrido: margen para máquinas cargadas (las esperas fijas siguen en el test).
  expect: { timeout: 10_000 },
  reporter: [["list"]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "desktop-chromium",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
    {
      name: "desktop-webkit",
      use: { ...devices["Desktop Safari"], viewport: { width: 1440, height: 900 } },
    },
    {
      name: "mobile-chromium",
      use: { ...devices["Desktop Chrome"], viewport: { width: 390, height: 844 }, hasTouch: true },
    },
    {
      name: "mobile-webkit",
      use: { ...devices["Desktop Safari"], viewport: { width: 390, height: 844 }, hasTouch: true },
    },
  ],
  webServer: {
    command: `npm run build && npx serve out -l ${PORT} --no-port-switching`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
