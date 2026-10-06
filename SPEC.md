# SPEC — Portafolio de Nairelys Hernández

> Estado: **v1.0 aprobada para implementar** · 2026-10-01
> Fuente de diseño: canvas "Portafolio — Spec Sheet" ([design/project/](design/project/)), pantalla **Reel** ([Reel.dc.html](design/project/Reel.dc.html)). Las demás variantes del canvas quedan fuera del alcance.
> Los insumos que aún faltan están en la §13 (no bloquean el inicio).

---

## 1. Objetivo

Un sitio personal que presente a Nairelys como desarrolladora full-stack (web + mobile) y lleve a quien lo visita a **contactarla**.

**Audiencia:** reclutadores (empleo) **y** clientes freelance, con el mismo peso. El sitio tiene que funcionar para ambos sin elegir entre ellos: la experiencia y LinkedIn para reclutadores, los proyectos, WhatsApp y "¡Hablemos de tu próximo proyecto!" para clientes.

**Métrica de éxito:** quien visita llega al panel de Contacto y hace clic en email, LinkedIn o WhatsApp.

### Fuera de alcance (v1)
- Blog, CMS o panel de administración.
- Páginas de detalle por proyecto y enlaces externos de proyectos.
- Formulario de contacto y CV descargable.
- Modo claro.
- Elementos de otras variantes del canvas (pieles del Camaleón, sección SDD en 4 pasos, ilustraciones).

---

## 2. Concepto de interacción: carrete horizontal movido con scroll vertical

El sitio es un **carrete horizontal de 6 paneles a pantalla completa**. La persona hace **scroll hacia abajo** (rueda, trackpad, teclado o deslizando el dedo en móvil) y el carrete se **desliza hacia la izquierda en proporción continua** al scroll, como si arrastrara una cinta. Puede quedar detenido entre dos paneles.

| # | Panel | id | Fondo |
|---|---|---|---|
| 01 | Inicio | `inicio` | `--bg` |
| 02 | Sobre mí | `sobre-mi` | `--bg-alt` |
| 03 | Stack | `stack` | `--bg` |
| 04 | Experiencia | `experiencia` | `--bg-alt` |
| 05 | Proyectos | `proyectos` | `--bg` |
| 06 | Contacto | `contacto` | `--bg-alt` |

```
┌ Header (fijo): ● NAIRELYS HERNÁNDEZ · email · GitHub · LinkedIn · ES|EN ┐
│                                                                                     │
│          [ Panel 01 ][ Panel 02 ][ Panel 03 ] …   ← se desplaza con el scroll        │
│                                                                                     │
└ Footer (fijo): ←  ● ━━ ● ● ● ●                         03 / 06 · STACK           →  ┘
```

### 2.1 Mecánica (técnica de sticky horizontal scroll)
- Un contenedor exterior de alto `N × 100dvh` (N = 6) aporta la distancia de scroll vertical nativa.
- Dentro, un contenedor `position: sticky; top: 0; height: 100dvh` contiene header, carrete y footer.
- `progreso = scrollY / (alto_exterior − 100dvh)` ∈ [0, 1].
- Carrete: `transform: translate3d(−progreso × (N − 1) × 100%, 0, 0)`; el `%` es del ancho del propio track, no `vw`, porque `100vw` incluye la barra de scroll de escritorio y desalinea los paneles, actualizado en `requestAnimationFrame` y **sin transición CSS** (el movimiento sigue al scroll 1:1).
- **Panel activo** = `round(progreso × (N − 1))`. Es el que usan los puntos, el contador y `aria-current`.
- Como el scroll es nativo, el teclado (↓ ↑ PageDown PageUp Espacio Home End) y el deslizamiento en móvil funcionan solos, sin código extra.
- Sin snap: si se suelta a medio camino, el carrete queda donde está.
- **Solo el eje vertical mueve el carrete.** El scroll horizontal del trackpad (dos dedos hacia los lados) no se mapea, para evitar conflictos entre ejes. En móvil el gesto es vertical: deslizar el dedo hacia arriba avanza el carrete.
- `panelTop(i)` calcula la posición con la distancia real de scroll: `top = i × (alto_exterior − alto_viewport) / (N − 1)`, midiendo en el momento. No se usa `innerHeight` a secas, porque en móvil `100dvh` e `innerHeight` pueden diferir.

---

## 3. Requisitos funcionales

### 3.1 Navegación

| ID | Requisito | Criterio de aceptación |
|---|---|---|
| NAV-1 | Scroll vertical → movimiento horizontal | Bajar 1 alto de ventana desplaza el carrete exactamente 1 panel. Subir lo revierte. El movimiento es fluido (60fps) en Chrome, Safari y Firefox, en escritorio y móvil. |
| NAV-2 | Botón → | Hace scroll suave hasta el inicio del panel siguiente. En el panel 06 hace scroll suave al 01 (cíclico). |
| NAV-3 | Botón ← | Hace scroll suave al panel anterior. En el 01 está deshabilitado. |
| NAV-4 | Puntos | Un punto por panel. El activo mide 32px y es `--pink`; los demás miden 14px y son `--line`, con transición de ancho de 0.4s. Al hacer clic se hace scroll suave a ese panel. |
| NAV-5 | Contador | Muestra `0N / 06 · <NOMBRE DEL PANEL>` según el panel activo. |
| NAV-6 | Nombre del header | Hace scroll suave al panel 01. |
| NAV-7 | "Ver proyectos" (hero) | Hace scroll suave al panel 05. |
| NAV-8 | Indicador de avance | En el panel 01, una pista sutil invita a hacer scroll y desaparece al empezar. Con puntero fino (`pointer: fine`) dice "Haz scroll ↓"; en táctil (`pointer: coarse`) dice "Desliza hacia arriba ↑" con una animación de dedo, porque en móvil el gesto es vertical aunque el carrete se mueva en horizontal. |
| NAV-9 | Reducción de movimiento | Con `prefers-reduced-motion: reduce`, los scrolls programáticos son instantáneos (`behavior: 'auto'`). El carrete sigue moviéndose con el scroll, porque lo controla quien visita. |
| NAV-10 | Redimensionar | Al cambiar el tamaño de la ventana o girar el dispositivo, el carrete se recoloca sin saltos visibles. |

"Scroll suave a panel i" = `window.scrollTo({ top: panelTop(i), behavior: 'smooth' })` (fórmula en §2.1).

### 3.2 Panel 01 · Inicio
- Eyebrow: "Perfil · full-stack · 8 años" (`--amber`).
- H1: "*Nairelys*" (Instrument Serif itálica con degradado `--grad`) y debajo "Hernández" (Space Grotesk 500).
- Bajada: "De microservicios en Scala a apps que la gente abre cada día. Ocho años construyendo productos que se sienten vivos."
- CTA principal **"Conversemos →"** → `mailto:njhs694@gmail.com`. CTA secundario **"Ver proyectos"** (NAV-7).
- Foto 4:5 ([foto-nairelys.webp](design/assets/foto-nairelys.webp), `object-position: 40% 30%`) sobre un marco en degradado rosa→ámbar desplazado, con anillo SVG de texto que gira (22s): "FULL-STACK ✦ WEB + MOBILE ✦ CARACAS, VE ✦ DESDE 2018 ✦" en `--lime`.
- Etiqueta flotante **"Disponible ✓"** (`--lime`), siempre visible.
- Decoración: manchas difusas con `floaty` (8s) y `drift` (11s).

### 3.3 Panel 02 · Sobre mí
- Eyebrow "Sobre mí" (`--pink`).
- H2: "Ingeniera en Computación, *Universidad Simón Bolívar*" (énfasis en serif `--amber`).
- Texto: "Base en Caracas, Venezuela. Me muevo del frontend al backend sin fricción y me obsesiona que cada interacción tenga ritmo. No escribo código aburrido."
- Cifras (serif itálica con degradado + etiqueta): **8** años · desde 2018 · **7** equipos · **5** productos · **3** plataformas.
- Chips: Caracas, VE · Ingeniería · Full-stack (este último en `--lime`).

### 3.4 Panel 03 · Stack
- Eyebrow "Stack" (`--amber`). H2: "La herramienta cambia, *yo me adapto*".
- Dos marquesinas infinitas a sangre (26s, sentidos opuestos):
  - Fila 1 (sans 500): React, Vue, Angular, Ionic, Next.js, TypeScript (con acentos rosa/lima/ámbar alternados).
  - Fila 2 (serif itálica): Node, Nest.js, Scala, React Native, MongoDB, Express, Java.
- "IA en mi flujo": chips Claude Code, Cursor, Gemini (al pasar el cursor, borde y texto `--pink`).
- "Método": "**Spec-Driven Development:** especificar → planificar → implementar con IA → verificar."

### 3.5 Panel 04 · Experiencia
- Eyebrow "Experiencia · 2018 — hoy" (`--lime`). H2: "Siete equipos, *ocho años de ritmo*".
- Filas de 3 columnas (años · empresa · detalle). Al pasar el cursor, el nombre de la empresa se pone `--pink`.

| Años | Empresa | Detalle |
|---|---|---|
| 2023 — | Apps2go | Microservicios · Scala |
| 2023 | Libre | Móvil · Ionic + full-stack |
| 2020 — 23 | BP Developments | Vue.js + Express / Nest.js |
| 2020 — 21 | Cronapis Corp | Frontend · Angular |
| 2020 | IPN Digital | Frontend · Angular |
| 2019 — 20 | DBAccess | Java · Oracle |
| 2018 — 19 | Grupo Ingenio Tecnológico | Ionic + Java nativo |

Fechas exactas (para JSON-LD): Oct 2023–hoy · Mar–Jul 2023 · Nov 2020–Abr 2023 · Ago 2020–Feb 2021 · Feb–Jun 2020 · Sep 2019–Feb 2020 · Mar 2018–Ago 2019.

### 3.6 Panel 05 · Proyectos

| ID | Requisito |
|---|---|
| PRJ-1 | Lista de 5 proyectos como `<button aria-pressed>`. El seleccionado se ve `--pink`; los demás `--ink` al 55%. Por defecto está seleccionado el 01. |
| PRJ-2 | Debajo de la lista: descripción y tags del proyecto seleccionado. |
| PRJ-3 | Eyebrow "Proyectos · 0N / 05". |
| PRJ-4 | A la derecha, un visual cuadrado (radio 24px) que cambia con el proyecto, con transición de fondo de 0.6s. |
| PRJ-5 | Sin enlaces externos en v1. |
| PRJ-7 | **Recorrido automático:** cada 2 s se selecciona el proyecto siguiente (cíclico: tras el 05 vuelve al 01). El visual nuevo se revela con un **círculo que crece desde el centro** (`clip-path: circle()`, 0.8s) sobre el anterior. Sin barra de progreso. La descripción reserva 3 líneas para que la lista no salte. |
| PRJ-8 | El recorrido solo corre con el panel 05 activo, y se pausa con el cursor sobre el panel o el foco dentro de la lista de proyectos (al reanudar, el conteo de 2 s empieza de nuevo). |
| PRJ-9 | Botón visible de pausar / reanudar junto al eyebrow (WCAG 2.2.2), `aria-label` "Pausar recorrido" / "Reanudar recorrido". Hacer clic en un proyecto detiene el recorrido (respeta la elección). Al reanudar arranca aunque el cursor siga encima. Mientras corre, la descripción no se anuncia (`aria-live="off"`). |
| PRJ-10 | Con `prefers-reduced-motion: reduce` el recorrido empieza en pausa; se puede activar con el botón. |
| PRJ-6 | El visual de cada proyecto se elige por config: si tiene captura (`image`), se muestra la imagen; si no, el mockup CSS del diseño. Al llegar las capturas (§13) basta con agregar el archivo y la ruta. |

| # | Proyecto | Descripción | Tags | Visual |
|---|---|---|---|---|
| 01 | Tu voz, tu cuento | Crea cuentos a partir de la narración de un niño: habla, y la app convierte su voz en una historia. | App + stack (§13) | Captura real de la pantalla de inicio dentro de un teléfono ([cuento.webp](public/images/projects/cuento.webp), recortada sin el pie de patrocinadores) |
| 02 | Vetsi | Atención médica primaria para mascotas. App Android e iOS con panel web, del diseño a producción. | Android, iOS, Panel web | [vetsi-collage.webp](design/assets/vetsi-collage.webp) |
| 03 | Wobber | Red social para moteros: rutas, rodadas y comunidad sobre dos ruedas. | Red social + stack (§13) | Captura (§13); por ahora mockup CSS de feed |
| 04 | Glik | Autogestión de usuarios: roles, accesos e invitaciones sin depender de soporte. | Web + stack (§13) | Captura (§13); por ahora mockup CSS de ventana |
| 05 | Libre | Aplicación de servicio de transporte. Desarrollé las apps móviles con Ionic y parte del full-stack. | Ionic, Full-stack, 2023 | Captura (§13); por ahora mockup CSS de mapa |

Mientras falte el stack de un proyecto, **no se muestra ningún tag placeholder** (nada de `[STACK]` visible).

### 3.7 Panel 06 · Contacto
- Avatar circular de 56px (borde `--pink`) y eyebrow "Contacto".
- H2: "¡Hablemos de tu *próximo proyecto!*"
- Email grande con degradado → `mailto:njhs694@gmail.com`.
- Botones: **LinkedIn** (relleno `--ink`), **GitHub** (borde), **WhatsApp** (borde y texto `--whatsapp`, con icono) → `https://wa.me/<número>`.
- Si `whatsapp` está vacío en la config, el botón de WhatsApp no se muestra.

---

## 4. Datos de contacto (confirmados)

| Canal | Valor |
|---|---|
| Email | `njhs694@gmail.com` |
| GitHub | `https://github.com/nairelyshz` |
| LinkedIn | `https://linkedin.com/in/nairelys-hernandez` |
| WhatsApp | `+58 424 270 4561` → `https://wa.me/584242704561` |

---

## 5. Internacionalización (ES / EN)

| ID | Requisito |
|---|---|
| I18N-1 | Español es el idioma por defecto en `/`; inglés en `/en/`. Ambos se generan como estáticos. |
| I18N-2 | Selector `ES · EN` en el header, que enlaza a la ruta equivalente. El idioma activo se marca con `aria-current="true"`. |
| I18N-3 | Todo el texto visible, los `aria-label`, alt, title, meta y OG salen de diccionarios (`content/es.ts`, `content/en.ts`) con el mismo tipo `Content`. TypeScript falla si a un idioma le falta una clave. |
| I18N-4 | `<html lang>` correcto por ruta y `<link rel="alternate" hreflang="es|en|x-default">`. |
| I18N-5 | Los nombres propios no se traducen (empresas, proyectos, tecnologías, Universidad Simón Bolívar). |
| I18N-6 | La traducción al inglés la redacta quien implementa y **Nairelys la revisa** antes del deploy. |
| I18N-7 | Sin redirección automática por idioma del navegador. |

---

## 6. Sistema visual (tokens)

### Colores (solo modo oscuro)
```css
--bg:       #141019;
--bg-alt:   #1E1826;
--ink:      #F5EFE7;
--muted:    #A8A0B6;
--line:     #2E2637;
--pink:     #FF5CE1;
--amber:    #FFB03A;
--lime:     #C6F14A;
--whatsapp: #5BE38F;
--grad: linear-gradient(90deg, #FF5CE1 0%, #FFB03A 55%, #C6F14A 100%);
```

### Tipografía (vía `next/font/google`, auto-alojada)
- **Space Grotesk** 400/500/600/700: cuerpo, UI y titulares.
- **Instrument Serif** 400 itálica: palabras de énfasis, nombre y cifras.
- Eyebrow: 12px, MAYÚSCULAS, 500, `letter-spacing: .35em`.
- Tamaños fluidos con `clamp()` + `min(vw, vh)`, tomados de [Reel.dc.html](design/project/Reel.dc.html).

### Forma y movimiento
- Botones y chips en píldora (`999px`); foto y visuales con radio 24–32px; bordes de 1px `--line`.
- Animaciones: `floaty` 8s, `drift` 11s, `pulse` 1.6s (punto del header), `marq` 26s, `spin` 22s.
- `prefers-reduced-motion: reduce` apaga todas las animaciones decorativas (ver también NAV-9).

---

## 7. Responsive

Regla: **cada panel cabe completo en 100dvh, sin scroll interno.** En pantallas chicas o bajas se **reduce contenido**; nunca se agrega scroll dentro de un panel.

| Condición | Cambios |
|---|---|
| ancho ≤ 820px | Hero a 1 columna con la foto arriba (más pequeña: `min(100%, 26vh)`; con 34vh la foto 4:5 empujaba los CTA debajo de la pista de scroll). Proyectos a 1 columna con el visual debajo de la lista. Se oculta el email del header. |
| ancho ≤ 820px | Experiencia: se oculta la columna "detalle". |
| ancho ≤ 820px | Proyectos: lista compacta; tags ocultos. |
| alto ≤ 700px | Stack: se oculta el bloque "IA en mi flujo / Método". Sobre mí: se ocultan los chips. Hero: se oculta la bajada. Proyectos (≤ 820px de ancho): visual a 24vh. |
| alto ≤ 600px | Proyectos (≤ 820px de ancho): se oculta el visual; quedan lista y descripción. Hero: foto a 20vh. Sobre mí: cifras y texto compactos. |
| ancho ≤ 480px | El contador muestra solo `0N / 06`. El header queda en nombre + selector de idioma; GitHub y LinkedIn se ocultan, porque siguen disponibles en el panel de Contacto. (Medido: a 390px el footer completo pide ~408px de 358 disponibles.) |
| ancho ≤ 360px | El footer queda en ← · puntos · →; el contador se oculta (los puntos con `aria-current` y la región `aria-live` ya indican el panel). |

- Ancho mínimo soportado: 320px, sin scroll horizontal de página.
- `100dvh` en lugar de `100vh` para que el carrete no salte cuando aparecen o desaparecen las barras del navegador en móvil.

---

## 8. Accesibilidad

- Controles reales (`<button>`, `<a href>`) con objetivo táctil ≥ 44px y foco visible (`outline` `--pink`).
- `aria-label` en ←/→ ("Panel anterior/siguiente") y en los puntos ("Ir a Stack"); `aria-current="step"` en el punto activo.
- **Navegación con Tab (A11Y-FOCUS):** al enfocar un elemento de otro panel, se hace scroll a ese panel para que el foco siempre quede visible:
  - Cada panel lleva `data-panel="<índice>"`. Un único listener `focusin` en el carrete obtiene `target.closest('[data-panel]')` y hace `window.scrollTo({ top: panelTop(i), behavior: 'auto' })` (instantáneo, para que el anillo de foco no aparezca a mitad de una animación).
  - Si el panel enfocado ya es el activo y está alineado, no hace nada (así se evitan saltos al tabular dentro del mismo panel).
  - El viewport del carrete usa `overflow: clip` (con `overflow: hidden` como fallback, más un reset de `scrollLeft = 0` en `focusin`). Así el navegador no desplaza el contenedor horizontalmente por su cuenta al enfocar un elemento fuera de vista, lo que desalinearía el `transform`.
  - Criterio: tabular de principio a fin recorre los 6 paneles en orden, y en todo momento el elemento enfocado es visible y el contador muestra su panel. Shift+Tab hace lo mismo en orden inverso.
- Región `aria-live="polite"` que anuncia "Panel 3 de 6: Stack" al cambiar el panel activo.
- Foto con `alt` descriptivo; mockups, manchas y anillo con `aria-hidden="true"`.
- Las marquesinas tienen una lista equivalente para lectores de pantalla (`sr-only`); las copias duplicadas llevan `aria-hidden`.
- Contraste AA en todo el texto (verificar `--muted` sobre `--bg-alt`).

---

## 9. SEO y metadatos

- Title: "Nairelys Hernández · Desarrolladora Full-Stack" / "… · Full-Stack Developer".
- Meta description por idioma.
- **Imagen OG** 1200×630 generada en build con el estilo del sitio: fondo `--bg`, "Nairelys" en serif itálica rosa sólido (`--pink`; la imagen OG no usa el degradado), "Hernández" y "Full-stack · Web + Mobile". Una por idioma.
- **Favicon**: el punto rosa `--pink` sobre `--bg` (SVG + PNG 32/180 para Apple).
- JSON-LD `Person`: name, jobTitle, alumniOf (Universidad Simón Bolívar), address (Caracas, VE), sameAs (GitHub, LinkedIn), knowsAbout (stack).
- El contenido de los 6 paneles está completo en el HTML estático.
- `sitemap.xml` y `robots.txt`.

---

## 10. Rendimiento

- Lighthouse móvil ≥ 95 en las 4 categorías.
- La foto del hero se precarga (`priority`); las demás imágenes cargan en diferido. Todas en WebP con dimensiones explícitas.
- El handler de scroll es `passive` y solo escribe `transform` dentro de `requestAnimationFrame` (no provoca recálculos de layout).
- JS de cliente < 100 KB gzip; peso total de la primera carga < 500 KB.

---

## 11. Stack técnico y estructura

- **Next.js** (App Router) con `output: 'export'` + **TypeScript** estricto.
- Estilos: CSS Modules + `globals.css` con los tokens. Sin librería de UI ni de animación.
- Fuentes con `next/font/google`. Imágenes con `next/image` (`unoptimized`, porque es export estático) usando WebP ya optimizados.
- Rutas: dos route groups, cada uno con su root layout: `app/(es)/` sirve `/` con `<html lang="es">` y `app/(en)/en/` sirve `/en/` con `<html lang="en">`. Un `app/global-not-found.tsx` da el 404 bilingüe. (`output: 'export'` no admite rewrites, y `[lang]` generaría `/es/`.)
- Despliegue: **Vercel**, conectado al repo de GitHub. Dominio: `*.vercel.app` hasta definir uno propio.

```
portfolio/
├─ SPEC.md
├─ design/                    # referencia del canvas (no se publica)
├─ public/images/             # foto, vetsi, capturas
├─ src/
│  ├─ app/(es)/{layout,page}.tsx      # /     · lang="es"
│  ├─ app/(en)/en/{layout,page}.tsx   # /en/  · lang="en"
│  ├─ app/global-not-found.tsx        # 404 bilingüe
│  ├─ components/
│  │  ├─ Reel.tsx             # contenedor sticky + lógica de progreso
│  │  ├─ ReelHeader.tsx  ReelFooter.tsx
│  │  └─ panels/Hero.tsx About.tsx Stack.tsx Experience.tsx Projects.tsx Contact.tsx
│  ├─ components/mockups/     # mockups CSS de proyectos
│  ├─ content/{types,es,en,site}.ts   # textos + config (contacto, proyectos)
│  └─ styles/globals.css
```

`content/site.ts` reúne los datos que no dependen del idioma: email, GitHub, LinkedIn, `whatsapp` (vacío = oculto), y por proyecto `image?` y `stack?`.

---

## 12. Criterios de "terminado"

1. Los 6 paneles reproducen Reel.dc.html a 1440×900, con diferencias visuales mínimas.
2. NAV-1…NAV-10 verificados en Chrome, Safari (macOS e iOS) y Firefox.
3. `/` y `/en/` completos, sin claves faltantes; el inglés revisado por Nairelys.
4. A 375×667 y 390×844 ningún panel se corta ni necesita scroll interno.
5. Lighthouse móvil ≥ 95 ×4; axe sin errores.
6. Desplegado en Vercel.

---

## 13. Insumos pendientes (no bloquean el inicio)

| # | Insumo | Dónde se usa | Mientras tanto |
|---|---|---|---|
| ~~P1~~ | ~~Número de WhatsApp~~ ✅ recibido 2026-10-04 | `site.ts → whatsapp` | — |
| P2 | Stack de Tu voz tu cuento, Wobber y Glik | `site.ts → projects[].stack` | No se muestra tag |
| P3 | Capturas de Wobber, Glik y Libre (Tu voz tu cuento ✅ 2026-10-04) | `public/images/projects/` + `projects[].image` (`imageFrame: "phone"` para capturas verticales de app) | Mockups CSS del diseño |
| P4 | Dominio propio (opcional) | Vercel | `*.vercel.app` |
