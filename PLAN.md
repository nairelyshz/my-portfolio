# PLAN — Portafolio de Nairelys Hernández

> Implementa: [SPEC.md](SPEC.md) v1.0 · Diseño: [design/project/Reel.dc.html](design/project/Reel.dc.html)
> Método: Spec-Driven Development. Cada tarea cita los IDs de la spec que satisface (`NAV-*`, `PRJ-*`, `I18N-*`, `§n`). Una fase se cierra solo cuando su checklist está completo.
> Entorno verificado: Node 22.20 · npm 10.9.

---

## 0. Decisiones técnicas que precisan la SPEC

| # | Tema | SPEC dice | Este plan hace | Por qué |
|---|---|---|---|---|
| D1 | Rutas i18n | `app/[lang]` + rewrite o página raíz | **Dos route groups con root layout propio**: `app/(es)/` sirve `/` y `app/(en)/en/` sirve `/en/` | `output: 'export'` no admite rewrites ni middleware, y `[lang]` generaría `/es/` en lugar de `/`. Con layouts raíz separados, cada ruta emite su propio `<html lang>` sin hacks. |
| D2 | Traslación del carrete | `−p × (N−1) × 100vw` | `−p × (N−1) × 100%` del propio track | En escritorio con barra de scroll visible, `100vw` incluye su ancho y desalinea los paneles unos píxeles. Con `%` el desplazamiento se mide contra el ancho real del track. |
| D3 | Panel activo y progreso | — | Se escriben en el DOM (`style.transform`, `data-*`) por ref. React solo se re-renderiza cuando cambia el **índice activo** | Así no hay un re-render por frame (§10). |
| D4 | Paneles | — | Paneles = **Server Components**. Solo `Reel`, `ReelHeader`, `ReelFooter` y `Projects` son Client Components | Mantiene el JS de cliente < 100 KB (§10). |
| D5 | Foco con Tab | `focusin` | No se usa `inert` en los paneles fuera de vista | `inert` impediría tabular hacia los demás paneles, y A11Y-FOCUS exige que Tab los recorra. |

Al cerrar la Fase 1, D1 y D2 se reflejan en la SPEC §11 y §2.1.

---

## 1. Arquitectura técnica y estrategia de archivos

### 1.1 Árbol de directorios

```
portfolio/
├─ SPEC.md · PLAN.md
├─ design/                              # referencia (no se publica, fuera de src/public)
├─ next.config.ts
├─ tsconfig.json                        # strict + noUncheckedIndexedAccess
├─ playwright.config.ts
├─ e2e/
│  ├─ reel.spec.ts                      # NAV-1…10, A11Y-FOCUS
│  ├─ i18n.spec.ts                      # I18N-1,2,4
│  └─ a11y.spec.ts                      # axe en / y /en/, 3 viewports
├─ public/
│  ├─ images/foto-nairelys.webp         # 750×800
│  ├─ images/vetsi-collage.webp         # 720×720
│  ├─ images/projects/                  # capturas P3 (cuando lleguen)
│  ├─ icon.svg · icon-32.png · apple-icon.png
└─ src/
   ├─ app/
   │  ├─ (es)/layout.tsx                # <html lang="es">
   │  ├─ (es)/page.tsx                  # <HomePage locale="es" />
   │  ├─ (es)/opengraph-image.tsx
   │  ├─ (en)/en/layout.tsx             # <html lang="en">
   │  ├─ (en)/en/page.tsx               # <HomePage locale="en" />
   │  ├─ (en)/en/opengraph-image.tsx
   │  ├─ sitemap.ts · robots.ts
   ├─ components/
   │  ├─ HomePage.tsx                   # server: ensambla paneles dentro de <Reel>
   │  ├─ reel/
   │  │  ├─ Reel.tsx                    # client: sticky + track + contexto
   │  │  ├─ ReelContext.tsx             # { active, count, goTo }
   │  │  ├─ ReelHeader.tsx              # client
   │  │  ├─ ReelFooter.tsx              # client: ←, puntos, contador, →
   │  │  ├─ LiveAnnouncer.tsx           # client: aria-live
   │  │  ├─ ScrollHint.tsx              # NAV-8
   │  │  └─ Reel.module.css
   │  ├─ panels/
   │  │  ├─ Panel.tsx                   # <section data-panel={i} id> + fondo
   │  │  ├─ Hero.tsx · About.tsx · Stack.tsx · Experience.tsx · Contact.tsx   # server
   │  │  ├─ Projects.tsx                # client (estado de selección)
   │  │  └─ *.module.css
   │  ├─ mockups/
   │  │  ├─ CuentoMockup.tsx · WobberMockup.tsx · GlikMockup.tsx · LibreMockup.tsx
   │  │  ├─ ProjectVisual.tsx           # imagen si existe, si no mockup (PRJ-6)
   │  │  └─ mockups.module.css
   │  └─ ui/
   │     ├─ Emph.tsx                    # renderiza { before, em, after }
   │     ├─ Eyebrow.tsx · Chip.tsx · Marquee.tsx · PillLink.tsx
   │     └─ icons.tsx                   # WhatsApp, flechas (SVG inline)
   ├─ hooks/
   │  ├─ useStickyScroll.ts             # §2 de este plan
   │  └─ usePrefersReducedMotion.ts
   ├─ content/
   │  ├─ types.ts                       # contratos (§1.2)
   │  ├─ site.ts                        # datos sin idioma
   │  ├─ es.ts · en.ts                  # diccionarios `satisfies Content`
   │  └─ index.ts                       # getContent(locale)
   ├─ lib/
   │  ├─ fonts.ts                       # next/font
   │  ├─ metadata.ts                    # buildMetadata(locale), JSON-LD
   │  ├─ format.ts                      # fmt('Ir a {panel}', { panel })
   │  └─ og.tsx                         # plantilla compartida de imagen OG
   ├─ assets/fonts/InstrumentSerif-Italic.ttf · SpaceGrotesk-Medium.ttf   # solo para OG
   └─ styles/
      ├─ tokens.css                     # variables §6
      └─ globals.css                    # reset, keyframes, utilidades, sr-only
```

### 1.2 Contratos TypeScript

`src/content/types.ts`

```ts
export const LOCALES = ['es', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

export const PANEL_IDS = ['inicio', 'sobre-mi', 'stack', 'experiencia', 'proyectos', 'contacto'] as const;
export type PanelId = (typeof PANEL_IDS)[number];

export const PROJECT_KEYS = ['cuento', 'vetsi', 'wobber', 'glik', 'libre'] as const;
export type ProjectKey = (typeof PROJECT_KEYS)[number];

export type StatKey = 'years' | 'teams' | 'products' | 'platforms';

/** Titular con un tramo en Instrument Serif itálica. */
export interface Emph { before: string; em: string; after?: string }

/** Plantillas con {placeholders}; se resuelven con fmt(). Todo serializable (cruza a Client Components). */
export interface Content {
  meta: { title: string; description: string; ogAlt: string; ogTagline: string };
  header: { langLabel: string };
  nav: {
    panels: Record<PanelId, string>;
    prev: string;               // "Panel anterior"
    next: string;
    goTo: string;               // "Ir a {panel}"
    announce: string;           // "Panel {n} de {total}: {panel}"
    hintPointer: string;        // "Haz scroll ↓"
    hintTouch: string;          // "Desliza hacia arriba ↑"
  };
  hero: {
    eyebrow: string; firstName: string; lastName: string; lead: string;
    ctaPrimary: string; ctaSecondary: string; ring: string; badge: string; photoAlt: string;
  };
  about: { eyebrow: string; title: Emph; body: string; stats: Record<StatKey, string>; chips: [string, string, string] };
  stack: { eyebrow: string; title: Emph; aiLabel: string; methodLabel: string; methodLead: string; methodBody: string; srListLabel: string };
  experience: { eyebrow: string; title: Emph; jobs: Array<{ years: string; name: string; detail: string }> };
  projects: {
    eyebrow: string;            // "Proyectos · {n} / 05"
    items: Record<ProjectKey, { name: string; desc: string; tags: string[]; visualAlt: string }>;
  };
  contact: { eyebrow: string; title: Emph; whatsapp: string; linkedin: string; github: string };
}
```

`src/content/site.ts`

```ts
import type { PanelId, ProjectKey, StatKey } from './types';

export interface ImageAsset { src: string; width: number; height: number }

export interface ProjectConfig {
  key: ProjectKey;
  n: `0${1 | 2 | 3 | 4 | 5}`;
  bg: string;                    // fondo del visual (PRJ-4)
  image?: ImageAsset;            // PRJ-6: si existe, reemplaza al mockup
  stack?: string[];              // P2: se añade a los tags; ausente = sin tag
}

export interface SiteConfig {
  url: string;                   // base absoluta para OG/sitemap
  name: string;
  email: string;
  github: string;
  linkedin: string;
  whatsapp: string;              // solo dígitos con código de país; '' = botón oculto (P1)
  photo: ImageAsset;
  panels: readonly PanelId[];
  stats: Record<StatKey, string>;
  marquee: { rowA: Array<{ label: string; tone?: 'pink' | 'lime' | 'amber' }>; rowB: Array<{ label: string; tone?: 'pink' | 'lime' | 'amber' | 'soft' }> };
  aiTools: string[];
  projects: ProjectConfig[];
  jobs: Array<{ name: string; start: string; end?: string }>;   // ISO yyyy-mm, para JSON-LD
}

export const site: SiteConfig = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nairelys.vercel.app',
  name: 'Nairelys Hernández',
  email: 'njhs694@gmail.com',
  github: 'https://github.com/nairelyshz',
  linkedin: 'https://linkedin.com/in/nairelys-hernandez',
  whatsapp: '',
  photo: { src: '/images/foto-nairelys.webp', width: 750, height: 800 },
  panels: ['inicio', 'sobre-mi', 'stack', 'experiencia', 'proyectos', 'contacto'],
  stats: { years: '8', teams: '7', products: '5', platforms: '3' },
  // marquee, aiTools: valores de SPEC §3.4
  projects: [
    { key: 'cuento', n: '01', bg: 'linear-gradient(160deg,#FFE7A8,#FFB86B)' },
    { key: 'vetsi',  n: '02', bg: '#0E0B12', image: { src: '/images/vetsi-collage.webp', width: 720, height: 720 } },
    { key: 'wobber', n: '03', bg: 'linear-gradient(160deg,#2A2A2A,#0F0F0F)' },
    { key: 'glik',   n: '04', bg: 'linear-gradient(160deg,#1B2550,#0B1020)' },
    { key: 'libre',  n: '05', bg: 'linear-gradient(160deg,#CFDBFF,#7F9BFF)' },
  ],
  // jobs: fechas de SPEC §3.5
} as const satisfies SiteConfig;
```

Reglas de los diccionarios:
- `es.ts` y `en.ts` exportan `const es = { … } satisfies Content`. Si falta una clave o sobra una, `tsc` falla (I18N-3).
- `experience.jobs` debe tener la misma longitud y orden que `site.jobs`. Un test unitario mínimo (o una aserción en `getContent`) lo verifica.
- Los nombres propios se repiten idénticos en ambos idiomas (I18N-5).

### 1.3 Configuración de Next.js

`next.config.ts`

```ts
import type { NextConfig } from 'next';

const config: NextConfig = {
  output: 'export',
  trailingSlash: true,          // genera /en/index.html → /en/ funciona en Vercel y en cualquier host estático
  images: { unoptimized: true },// export estático: los WebP ya vienen optimizados
  reactStrictMode: true,
};
export default config;
```

`src/lib/fonts.ts`

```ts
import { Space_Grotesk, Instrument_Serif } from 'next/font/google';

export const grotesk = Space_Grotesk({
  subsets: ['latin'], weight: ['400', '500', '600', '700'],
  variable: '--font-sans', display: 'swap',
});
export const serif = Instrument_Serif({
  subsets: ['latin'], weight: '400', style: 'italic',
  variable: '--font-serif', display: 'swap',
});
```

Root layout (igual en `(es)` y `(en)/en`, cambia solo `locale`):

```tsx
// src/app/(es)/layout.tsx
import '@/styles/globals.css';
import { grotesk, serif } from '@/lib/fonts';
import { buildMetadata, personJsonLd } from '@/lib/metadata';

export const metadata = buildMetadata('es');   // title, description, alternates.languages, icons, openGraph

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${grotesk.variable} ${serif.variable}`}>
      <body>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd('es')) }} />
      </body>
    </html>
  );
}
```

`buildMetadata(locale)` define `alternates.languages = { es: '/', en: '/en/', 'x-default': '/' }` (I18N-4) y `metadataBase: new URL(site.url)`.

---

## 2. Mecánica del carrete: `useStickyScroll`

### 2.1 Estructura DOM

```html
<div class="outer" style="height: calc(var(--panels) * 100dvh)">   ← aporta la distancia de scroll
  <div class="sticky" (position: sticky; top: 0; height: 100dvh; display: grid; grid-template-rows: auto 1fr auto)>
    <header/>
    <div class="viewport" (overflow: clip; overflow: hidden como fallback)>
      <div class="track" (display: flex; height: 100%; will-change: transform)>
        <section data-panel="0" id="inicio" (flex: 0 0 100%)/> … ×6
      </div>
    </div>
    <footer/>
  </div>
</div>
```

`overflow: clip` va declarado después de `overflow: hidden`, así los navegadores que no lo entienden se quedan con `hidden`.

### 2.2 Hook

`src/hooks/useStickyScroll.ts`

```ts
'use client';
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';

interface Refs {
  outer: RefObject<HTMLElement | null>;
  sticky: RefObject<HTMLElement | null>;
  viewport: RefObject<HTMLElement | null>;
  track: RefObject<HTMLElement | null>;
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function useStickyScroll({ outer, sticky, viewport, track }: Refs, count: number) {
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const m = useRef({ start: 0, range: 1 });     // métricas medidas, no estado
  const frame = useRef<number | null>(null);

  /** Medir: inicio absoluto del outer y distancia de scroll disponible (SPEC §2.1, panelTop). */
  const measure = useCallback(() => {
    const o = outer.current, s = sticky.current;
    if (!o || !s) return;
    m.current.start = o.getBoundingClientRect().top + window.scrollY;
    m.current.range = Math.max(1, o.offsetHeight - s.offsetHeight);
  }, [outer, sticky]);

  const progress = () => clamp01((window.scrollY - m.current.start) / m.current.range);

  /** Escribir en el DOM; solo actualiza estado React si cambia el panel activo (D3). */
  const render = useCallback(() => {
    frame.current = null;
    const p = progress();
    if (track.current) {
      track.current.style.transform = `translate3d(${-p * (count - 1) * 100}%,0,0)`;
    }
    outer.current?.toggleAttribute('data-scrolled', p > 0.005);   // NAV-8: oculta la pista
    const i = Math.round(p * (count - 1));
    if (i !== activeRef.current) { activeRef.current = i; setActive(i); }
  }, [count, outer, track]);

  const schedule = useCallback(() => {
    if (frame.current == null) frame.current = requestAnimationFrame(render);
  }, [render]);

  const panelTop = useCallback(
    (i: number) => m.current.start + (i * m.current.range) / (count - 1),
    [count],
  );

  /** NAV-2/3/4/6/7. NAV-9: con reduced motion el salto es instantáneo. */
  const goTo = useCallback((i: number, opts?: { instant?: boolean }) => {
    const target = Math.min(count - 1, Math.max(0, i));
    window.scrollTo({
      top: panelTop(target),
      behavior: opts?.instant || reducedMotion() ? 'auto' : 'smooth',
    });
  }, [count, panelTop]);

  // Pintar antes del primer paint para evitar un frame desalineado (p. ej. al recargar a mitad de página).
  useLayoutEffect(() => { measure(); render(); }, [measure, render]);

  useEffect(() => {
    const onScroll = () => schedule();

    // NAV-10: conservar el progreso al redimensionar o rotar el dispositivo.
    const onResize = () => {
      const p = progress();
      measure();
      window.scrollTo({ top: m.current.start + p * m.current.range, behavior: 'auto' });
      render();
    };

    const ro = new ResizeObserver(onResize);
    if (sticky.current) ro.observe(sticky.current);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('orientationchange', onResize);

    // A11Y-FOCUS: sincronizar el scroll vertical con el panel del elemento enfocado.
    const vp = viewport.current;
    const onFocusIn = (e: FocusEvent) => {
      if (vp) vp.scrollLeft = 0;                         // anula el auto-scroll horizontal del navegador
      const panel = (e.target as Element | null)?.closest<HTMLElement>('[data-panel]');
      if (!panel) return;
      const i = Number(panel.dataset.panel);
      if (Math.abs(window.scrollY - panelTop(i)) > 1) goTo(i, { instant: true });
    };
    vp?.addEventListener('focusin', onFocusIn);

    return () => {
      ro.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('orientationchange', onResize);
      vp?.removeEventListener('focusin', onFocusIn);
      if (frame.current != null) cancelAnimationFrame(frame.current);
    };
  }, [goTo, measure, panelTop, render, schedule, sticky, viewport]);

  return { active, goTo };
}
```

### 2.3 Notas de comportamiento

| Caso | Comportamiento esperado | Cubre |
|---|---|---|
| Recarga a mitad de página | El navegador restaura `scrollY`; `useLayoutEffect` pinta la posición correcta antes de que se vea | NAV-10 |
| Barra de URL en iOS que aparece o desaparece | Cambia el alto del sticky (`100dvh`) → el ResizeObserver remide y conserva el progreso | NAV-10, §7 |
| Scroll horizontal del trackpad | Se ignora; no hay listener `wheel` | §2.1 |
| Tab dentro del mismo panel | `|scrollY − panelTop(i)| ≤ 1` → no se mueve | A11Y-FOCUS |
| Tab a otro panel | Salto instantáneo y el contador se actualiza en el siguiente frame | A11Y-FOCUS |
| `→` en el panel 06 | `ReelFooter` llama `goTo(0)` (cíclico); `←` en el 01 está `disabled` | NAV-2, NAV-3 |
| Reduced motion | `goTo` usa `auto`; el carrete sigue el scroll 1:1 (no tiene transición que apagar) | NAV-9 |

`ReelContext` expone `{ active, count, goTo }` a `ReelHeader`, `ReelFooter`, `LiveAnnouncer` y `Hero` (botón "Ver proyectos" → `goTo(4)`). `Hero` es server, así que ese botón vive en un pequeño client component `GoToButton`.

---

## 3. Plan por fases

Convención: ☐ = tarea · ✅ = criterio de salida de la fase. Cada fase termina con `npm run check` en verde y un commit.

### Fase 1 — Setup y foundation

> **Estado: ✅ completada (2026-10-01)** · Next.js 16.3.8 · React 19.2. Agregado respecto al plan: `app/global-not-found.tsx` (flag `experimental.globalNotFound`), porque con dos root layouts el 404 por defecto salía sin `lang` ni estilos. Los textos de experiencia se indexan por `JobKey` (en lugar de un array paralelo), así el tipo garantiza que coincidan con `site.jobs`. `src/components/HomePage.tsx` es provisional hasta la Fase 2.

| # | Tarea | SPEC |
|---|---|---|
| 1.1 | `npx create-next-app@latest . --ts --app --src-dir --eslint --no-tailwind --import-alias "@/*"`. Mover `design/` fuera del alcance de lint. | §11 |
| 1.2 | `next.config.ts` (§1.3), `tsconfig` con `strict` y `noUncheckedIndexedAccess`. | §11 |
| 1.3 | Scripts: `dev`, `build`, `start` (`npx serve out`), `typecheck` (`tsc --noEmit`), `lint`, `test:e2e` (Playwright), `check` = typecheck + lint + build. | §12 |
| 1.4 | `styles/tokens.css`: colores §6 y escala tipográfica fluida (`--fs-h1: clamp(54px, min(8.6vw, 13vh), 136px)`, `--fs-h2: clamp(30px, min(4vw, 6.6vh), 60px)`, `--fs-body: clamp(15px, min(1.4vw, 2.3vh), 19px)`, `--fs-stat: clamp(48px, min(6vw, 10vh), 88px)`, `--fs-marq-a`, `--fs-marq-b`, `--fs-project`, `--fs-email`), gutter `--gx: clamp(20px, 5vw, 72px)`. | §6 |
| 1.5 | `styles/globals.css`: reset, `body{background:var(--bg);color:var(--ink);font-family:var(--font-sans)}`, keyframes `floaty drift pulse marq spin`, utilidades `.grad` (texto con degradado), `.sr-only`, `:focus-visible{outline:2px solid var(--pink);outline-offset:3px}`, bloque `prefers-reduced-motion`. | §6, §8 |
| 1.6 | `lib/fonts.ts` y root layouts `(es)` y `(en)/en` con `lang` correcto. | §6, I18N-1, I18N-4 |
| 1.7 | `content/types.ts`, `site.ts`, `es.ts` (copy literal de la SPEC §3), `en.ts` (traducción redactada), `index.ts`, `lib/format.ts`. | I18N-3, I18N-5 |
| 1.8 | Copiar `design/assets/*.webp` → `public/images/`. | §11 |
| 1.9 | Actualizar SPEC §11 y §2.1 con D1 y D2. | — |

✅ Salida:
- `npm run build` genera `out/index.html` y `out/en/index.html`, cada uno con su `lang`.
- Quitar una clave de `en.ts` rompe `npm run typecheck`.
- Las dos fuentes se sirven auto-alojadas (sin requests a fonts.googleapis.com en runtime).

### Fase 2 — Layout del carrete y navegación

> **Estado: ✅ completada (2026-10-01)** · `e2e/` 48 tests × 4 proyectos (Chromium/WebKit × 1440×900/390×844), 3 repeticiones sin fallos.
> Ajustes respecto al plan:
> - `useStickyScroll(count)` **crea y devuelve** los refs (React Compiler/`react-hooks/immutability` no permite mutar refs recibidos como argumento).
> - `.sticky` necesita `grid-template-columns: minmax(0, 1fr)`; sin esto la columna crecía al min-content de los 6 paneles (panel de 2638px a 1440px de ventana).
> - `outer` mide `N × 100svh` (estable con la barra de URL de iOS). `onResize` solo re-ancla el scroll si cambió el ancho o si no se está desplazando, para no cortar la inercia en iOS.
> - Móvil ≤ 480px: contador sin nombre, header sin GitHub/LinkedIn (SPEC §7 actualizada); `body { overflow-x: clip }`.
> - WebKit: los tests de foco usan Alt+Tab (Safari no enfoca enlaces con Tab por defecto).

| # | Tarea | SPEC |
|---|---|---|
| 2.1 | `useStickyScroll` (§2.2) y `ReelContext`. | §2.1, NAV-1, NAV-10 |
| 2.2 | `Reel.tsx` + `Reel.module.css`: estructura §2.1, `--panels: 6`, viewport con `overflow: clip`. | §2.1 |
| 2.3 | `Panel.tsx`: `<section id={id} data-panel={i} aria-labelledby>`, fondo `--bg`/`--bg-alt` alternado, padding `0 var(--gx)`, `overflow: hidden`, `position: relative`. | §2 |
| 2.4 | `ReelHeader`: punto con `pulse`, nombre (button → `goTo(0)`), email, GitHub, LinkedIn y selector `ES · EN` (`<a href="/">` / `<a href="/en/">`, con `aria-current="true"` en el activo). | NAV-6, I18N-2 |
| 2.5 | `ReelFooter`: ← (`disabled` en el 0), puntos (`button`, ancho 32/14px con transición `width .4s`, `aria-label={fmt(goTo)}`, `aria-current="step"` en el activo), contador `0N / 06 · NOMBRE`, → (cíclico). Botones de 44×44. | NAV-2…5 |
| 2.6 | `LiveAnnouncer`: `<p aria-live="polite" class="sr-only">`. No anuncia en el montaje inicial, solo en cambios posteriores. | §8 |
| 2.7 | `ScrollHint`: dos variantes con `@media (pointer: fine)` y `(pointer: coarse)`; oculta con `[data-scrolled] .hint{opacity:0}`. | NAV-8 |
| 2.8 | `HomePage.tsx` con 6 paneles placeholder (solo título) y `GoToButton`. | — |
| 2.9 | Playwright: `e2e/reel.spec.ts` (ver casos abajo). | NAV-*, A11Y-FOCUS |

Casos de `reel.spec.ts` (viewport 1440×900 y 390×844):
- `scrollTo(panelTop(2))` → `#stack` alineado a `x = 0` (±1px) y contador `03 / 06`.
- Scroll a `1.5 × alto` → track en `−150%` (continuo, sin snap).
- Click → ×6 → vuelve al panel 01. ← está `disabled` en el 01.
- Click en el punto 4 → contador `04 / 06`.
- Tab repetido desde el inicio → el elemento enfocado siempre queda dentro del viewport (comprobado con `boundingBox`).
- Resize de 1440×900 a 900×1200 estando en el panel 3 → sigue en el panel 3.
- `emulateMedia({ reducedMotion: 'reduce' })` → `goTo` llega en < 50 ms.

✅ Salida: `reel.spec.ts` en verde en Chromium y WebKit; la Performance de DevTools no muestra layout thrash durante el scroll (solo composite).

### Fase 3 — Paneles 01 a 06

> **Estado: ✅ completada (2026-10-04)** · 68 tests e2e en verde (+ `projects.spec.ts`: PRJ-1/2/3/6, sin placeholders `[..]`, WhatsApp oculto, ningún panel desborda).
> Ajustes: los mockups escalan con container queries (`cqw`) para verse igual a 560px y en móvil; foto del hero en móvil `26vh` (con 34vh la pista NAV-8 tapaba los CTA; SPEC §7 actualizada); componentes compartidos `ui/Emph` (Emph + Eyebrow), `ui/Blob`, `ui/Marquee` y utilidades globales `.title`, `.pill`, `.chip`.

Referencia de medidas: los estilos inline de [Reel.dc.html](design/project/Reel.dc.html) se trasladan a CSS Modules con los tokens; no quedan valores sueltos que repitan un token.

**3.1 Panel 01 · Inicio** — `Hero.tsx`
- ☐ Grid `.hero` `minmax(0,1.1fr) minmax(0,1fr)`.
- ☐ Eyebrow `--amber`, H1 con `.grad` serif + apellido sans, bajada `--muted`.
- ☐ CTA "Conversemos →" (`mailto:`, rosa, alto 48px) y `GoToButton` "Ver proyectos" → `goTo(4)`.
- ☐ Foto con `next/image` `priority`, `sizes="(max-width: 820px) 34vh, 440px"`, `object-position: 40% 30%`, radio 32px. Marco degradado desplazado (`inset: 8% -6% -6% 8%`).
- ☐ Anillo SVG: `<textPath>` con `site`/`hero.ring`, `--lime`, `.spin`, `aria-hidden`.
- ☐ Badge "Disponible ✓" (`.floaty`, `--lime`).
- ☐ 3 manchas decorativas (`aria-hidden`).
- ☐ `ScrollHint` posicionado abajo.
- Cubre §3.2, NAV-7, NAV-8.

**3.2 Panel 02 · Sobre mí** — `About.tsx`
- ☐ Eyebrow `--pink`, `<Emph>` con énfasis `--amber`, cuerpo `--muted` (`max-width: 54ch`).
- ☐ Grid de cifras `repeat(auto-fit, minmax(130px,1fr))`, borde superior `--line`, número `.grad` serif con `--fs-stat`. Valores desde `site.stats` y etiquetas desde `about.stats`.
- ☐ 3 chips (el último en `--lime`).
- Cubre §3.3.

**3.3 Panel 03 · Stack** — `Stack.tsx` + `ui/Marquee.tsx`
- ☐ `Marquee` recibe `items` y `reverse`; renderiza la lista **dos veces** dentro de `.marq` (`width: max-content`, `translateX(-50%)` en 26s). La segunda copia lleva `aria-hidden`.
- ☐ La fila sale a sangre con `margin-inline: calc(-1 * var(--gx))`.
- ☐ `<ul class="sr-only" aria-label={stack.srListLabel}>` con todas las tecnologías.
- ☐ Bloque "IA en mi flujo" (chips con hover `--pink`) + "Método" SDD.
- Cubre §3.4, §8.

**3.4 Panel 04 · Experiencia** — `Experience.tsx`
- ☐ `<ol>` semántica; cada fila es un grid `96px minmax(0,1fr) minmax(0,1.2fr)`, padding `clamp(6px,1.2vh,12px)`, borde inferior.
- ☐ Hover `.row:hover .name{color:var(--pink)}` con transición de 0.2s.
- ☐ `≤820px`: la columna detalle tiene `display:none` y el grid pasa a `80px 1fr`.
- Cubre §3.5, §7.

**3.5 Panel 05 · Proyectos** — `Projects.tsx` (client) + `mockups/`
- ☐ Estado `selected: ProjectKey = 'cuento'`.
- ☐ Lista de `<button aria-pressed>`; color `--pink` si está seleccionado y `rgb(245 239 231 / .55)` si no. Mínimo 44px. Eyebrow con `fmt(projects.eyebrow, { n })`.
- ☐ Descripción y tags = `items[key].tags` + `site.projects[key].stack ?? []`. Nunca se muestra un string `[STACK]`; un test unitario de `getTags()` lo verifica.
- ☐ `ProjectVisual`: contenedor cuadrado `width: min(100%, 58vh, 560px)`, radio 24px, `background: bg` con `transition: background .6s`. Si hay `image` → `next/image` lazy con `alt={visualAlt}`; si no → mockup por `key` (`aria-hidden`).
- ☐ 4 mockups portados del diseño a JSX + CSS Module (Cuento, Wobber, Glik, Libre), dimensionados en % del contenedor para que escalen.
- ☐ Grid `.split` `minmax(0,1fr) minmax(0,1.2fr)`; `≤820px` a 1 columna y tags ocultos.
- Cubre PRJ-1…6, §7, P2, P3.

**3.6 Panel 06 · Contacto** — `Contact.tsx`
- ☐ Avatar de 56px (misma foto, `alt=""`), eyebrow, `<Emph>`.
- ☐ Email gigante `.grad` (`--fs-email`, `word-break: break-all`).
- ☐ LinkedIn (relleno `--ink`), GitHub (borde) y WhatsApp **solo si `site.whatsapp !== ''`** → `https://wa.me/${site.whatsapp}` con icono SVG.
- ☐ Todos los enlaces externos llevan `rel="noopener"` y `target="_blank"`, salvo `mailto:`.
- Cubre §3.7, §4, P1.

✅ Salida de la fase:
- A 1440×900, cada panel comparado lado a lado con Reel.dc.html: misma jerarquía, colores, tipografía y espaciado.
- `/en/` muestra todo traducido y sin claves vacías.
- Con `whatsapp: ''` no aparece el botón; con un número, aparece y enlaza a `wa.me`.

### Fase 4 — Accesibilidad, responsive y polish

> **Estado: ✅ automatizable completado (2026-10-04)** · `e2e/a11y.spec.ts`: barrido 7 viewports × 2 idiomas (sin scroll horizontal, sin barras desbordadas, ningún contenido no decorativo cortado, la pista NAV-8 no tapa controles) + axe (WCAG 2.2 AA + best-practice) en `/` y `/en/` a 1440×900, 390×844 y 375×667: **0 violaciones**. Suite completa 88 tests, ×2 sin fallos.
> Correcciones: puntos del footer con área de clic 24px (axe `target-size`, WCAG 2.5.8); footer ≤ 360px sin contador; CTA del hero compactos ≤ 360px; foto del hero 20vh y "Sobre mí" compacto en alturas ≤ 600px; la pista de scroll pasa al flujo bajo los CTA en una columna.
> Contraste medido: `--muted`/`--bg-alt` ≈ 6.9:1, `--pink`/`--bg` ≈ 7.3:1 (AA ✓).
> **Pendiente manual:** 4.4 VoiceOver (macOS/iOS) y recorrido con teclado en Safari real.

| # | Tarea | SPEC |
|---|---|---|
| 4.1 | Responsive §7 completo: `@media (max-width: 820px)` (hero en 1 columna con la foto `order:-1` y `width: min(100%, 34vh)`; proyectos en 1 columna; ocultar email del header; ocultar columna detalle y tags) · `@media (max-height: 700px)` (ocultar IA/Método, chips de Sobre mí y bajada del hero) · `@media (max-width: 379px)` (contador sin nombre). | §7 |
| 4.2 | Barrido de desbordes: en 320×568, 375×667, 390×844, 768×1024, 1024×768, 1440×900 y 1920×1080, ningún panel tiene `scrollHeight > clientHeight` ni hay scroll horizontal de página. Automatizado en `a11y.spec.ts`. | §7, §12-4 |
| 4.3 | `prefers-reduced-motion`: `animation: none` en `.floaty .drift .pulse .marq .spin`, sin transición en puntos ni proyectos. | §6, NAV-9 |
| 4.4 | `LiveAnnouncer` verificado con VoiceOver (macOS) y mensaje traducido. | §8 |
| 4.5 | Contraste: medir `--muted` sobre `--bg-alt` (#A8A0B6 / #1E1826 ≈ 7:1, AA ✓) y el texto rosa sobre `--bg`. Documentar los valores en el PR. | §8 |
| 4.6 | Foco visible en todos los controles; orden de Tab = orden visual. | §8 |
| 4.7 | `e2e/a11y.spec.ts` con `@axe-core/playwright` en `/` y `/en/` a 1440×900, 390×844 y 375×667. | §12-5 |

✅ Salida: `a11y.spec.ts` sin violaciones; el barrido 4.2 en verde; recorrido completo con teclado y con VoiceOver sin bloqueos.

### Fase 5 — SEO, metadatos y verificación final

| # | Tarea | SPEC |
|---|---|---|
| 5.1 | `lib/metadata.ts`: `buildMetadata(locale)` (title, description, `alternates`, `openGraph`, `twitter: summary_large_image`, `icons`) y `personJsonLd(locale)` (`Person`, `jobTitle`, `alumniOf`, `address`, `sameAs`, `knowsAbout`, `worksFor` = Apps2go). | §9, I18N-4 |
| 5.2 | `opengraph-image.tsx` por idioma con `ImageResponse` 1200×630 (`export const dynamic = 'force-static'`): fondo `#141019`, "Nairelys" en Instrument Serif itálica, **color sólido `#FF5CE1`** (sin degradado ni `background-clip: text`, para que el render en build sea determinista), "Hernández" en Space Grotesk `#F5EFE7` y `meta.ogTagline` en `#A8A0B6`. La plantilla vive en `src/lib/og.tsx` y la usan los dos idiomas. Fuentes leídas de `src/assets/fonts/` con `fs.readFile`. | §9 |
| 5.3 | Favicon: `public/icon.svg` (círculo `#FF5CE1` sobre `#141019`, radio 6) + `icon-32.png` y `apple-icon.png` (180) exportados con `sharp` en un script `scripts/icons.mjs`. | §9 |
| 5.4 | `app/sitemap.ts` (`/` y `/en/` con `alternates.languages`) y `app/robots.ts` (allow all + sitemap), ambos `force-static`. | §9 |
| 5.5 | Lighthouse CI: `@lhci/cli` contra `npx serve out`, preset móvil, aserciones `≥ 0.95` en las 4 categorías, para `/` y `/en/`. | §10, §12-5 |
| 5.6 | Presupuesto: comprobar en `out/` que el JS de cliente es < 100 KB gzip y la primera carga < 500 KB. | §10 |
| 5.7 | Pruebas manuales: Safari macOS, Safari iOS (dispositivo real: barra de URL, rotación) y Firefox. | §12-2 |
| 5.8 | Revisión del inglés por Nairelys (bloqueante para el deploy). | I18N-6 |
| 5.9 | Deploy: repo en GitHub → proyecto Vercel (framework Next.js; Vercel detecta `output: 'export'`) y `NEXT_PUBLIC_SITE_URL` con la URL final. | §11, §12-6 |

✅ Salida = Criterios de "terminado" de SPEC §12:
- ☐ 1. Fidelidad visual a 1440×900.
- ☐ 2. NAV-1…10 en Chrome, Safari (macOS/iOS) y Firefox.
- ☐ 3. `/` y `/en/` completos; inglés aprobado.
- ☐ 4. 375×667 y 390×844 sin cortes ni scroll interno.
- ☐ 5. Lighthouse ≥ 95 ×4 · axe sin violaciones.
- ☐ 6. Publicado en Vercel.

---

## 4. Matriz de trazabilidad

| SPEC | Implementación | Verificación |
|---|---|---|
| §2.1, NAV-1 | `useStickyScroll.render` | reel.spec: track −150% |
| NAV-2, NAV-3 | `ReelFooter` | reel.spec: ciclo y disabled |
| NAV-4, NAV-5 | `ReelFooter` | reel.spec: punto 4 |
| NAV-6, NAV-7 | `ReelHeader`, `GoToButton` | reel.spec |
| NAV-8 | `ScrollHint`, `data-scrolled` | manual (fine/coarse) |
| NAV-9 | `goTo` + CSS reduced motion | reel.spec (emulateMedia) |
| NAV-10 | `onResize` + ResizeObserver | reel.spec: resize |
| A11Y-FOCUS | `onFocusIn` | reel.spec: Tab |
| PRJ-1…6 | `Projects`, `ProjectVisual`, `getTags` | unit + manual |
| I18N-1…7 | route groups, `content/*`, header | i18n.spec + tsc |
| §7 | CSS Modules media queries | a11y.spec barrido |
| §8 | `LiveAnnouncer`, `Marquee`, focus | axe + VoiceOver |
| §9 | `metadata.ts`, OG, sitemap | Lighthouse SEO |
| §10 | D3, D4, imágenes | Lighthouse Perf + presupuesto |

---

## 5. Riesgos

| Riesgo | Mitigación |
|---|---|
| iOS Safari: `100dvh` + sticky provoca saltos al mostrar u ocultar la barra de URL | El ResizeObserver conserva el progreso; probar en un dispositivo real en la Fase 2, no al final |
| Foto de 750×800 algo corta para 440px en pantallas 2× (pide unos 880px de ancho) | Pedir una versión ≥ 900px de ancho; mientras tanto se ve aceptable |
| Contenido que no cabe en alturas intermedias (700–760px) | El barrido 4.2 lo detecta; se ajusta con un `clamp()` o un breakpoint extra de altura |
| Insumos P1–P3 que llegan tarde | Ya están contemplados en la config (`whatsapp`, `stack?`, `image?`); agregarlos no requiere cambiar código |
