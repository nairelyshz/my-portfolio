import type { Content } from "./types";

/** Copy literal de SPEC §3 (diseño Reel). */
export const es = {
  meta: {
    title: "Nairelys Hernández · Desarrolladora Full-Stack",
    description:
      "Desarrolladora full-stack en Caracas, Venezuela. Ocho años construyendo apps web y móviles con React, Vue, Node, NestJS, Scala, Ionic y React Native.",
    ogAlt: "Nairelys Hernández, desarrolladora full-stack web y mobile",
    ogTagline: "Full-stack · Web + Mobile",
  },
  header: {
    langLabel: "Idioma",
  },
  nav: {
    label: "Navegación entre paneles",
    panels: {
      inicio: "Inicio",
      "sobre-mi": "Sobre mí",
      stack: "Stack",
      experiencia: "Experiencia",
      proyectos: "Proyectos",
      contacto: "Contacto",
    },
    prev: "Panel anterior",
    next: "Panel siguiente",
    goTo: "Ir a {panel}",
    announce: "Panel {n} de {total}: {panel}",
    hintPointer: "Haz scroll ↓",
    hintTouch: "Desliza hacia arriba ↑",
  },
  hero: {
    eyebrow: "Perfil · full-stack · 8 años",
    firstName: "Nairelys",
    lastName: "Hernández",
    lead: "De microservicios en Scala a apps que la gente abre cada día. Ocho años construyendo productos que se sienten vivos.",
    ctaPrimary: "Conversemos",
    ctaSecondary: "Ver proyectos",
    ring: "FULL-STACK ✦ WEB + MOBILE ✦ CARACAS, VE ✦ DESDE 2018 ✦ ",
    badge: "Disponible ✓",
    photoAlt: "Foto de Nairelys Hernández",
  },
  about: {
    eyebrow: "Sobre mí",
    title: { before: "Ingeniera en Computación, ", em: "Universidad Simón Bolívar" },
    body: "Base en Caracas, Venezuela. Me muevo del frontend al backend sin fricción y me obsesiona que cada interacción tenga ritmo. No escribo código aburrido.",
    stats: {
      years: "años · desde 2018",
      teams: "equipos",
      products: "productos",
      platforms: "plataformas",
    },
    chips: ["Caracas, VE", "Ingeniería", "Full-stack"],
  },
  stack: {
    eyebrow: "Stack",
    title: { before: "La herramienta cambia, ", em: "yo me adapto" },
    aiLabel: "IA en mi flujo",
    methodLabel: "Método",
    methodLead: "Spec-Driven Development:",
    methodBody: "especificar → planificar → implementar con IA → verificar.",
    srListLabel: "Tecnologías",
  },
  experience: {
    eyebrow: "Experiencia · 2018 — hoy",
    title: { before: "Siete equipos, ", em: "ocho años de ritmo" },
    details: {
      apps2go: "Microservicios · Scala",
      libre: "Móvil · Ionic + full-stack",
      bp: "Vue.js + Express / Nest.js",
      cronapis: "Frontend · Angular",
      ipn: "Frontend · Angular",
      dbaccess: "Java · Oracle",
      ingenio: "Ionic + Java nativo",
    },
  },
  projects: {
    eyebrow: "Proyectos · {n} / 05",
    listLabel: "Proyectos",
    autoplayPause: "Pausar recorrido",
    autoplayPlay: "Reanudar recorrido",
    items: {
      cuento: {
        name: "Tu voz, tu cuento",
        desc: "Crea cuentos a partir de la narración de un niño: habla, y la app convierte su voz en una historia.",
        tags: ["App"],
        visualAlt:
          "Pantalla de inicio de Tu voz, tu cuento: logo, título y botones Crear cuenta y Comenzar",
      },
      vetsi: {
        name: "Vetsi",
        desc: "Atención médica primaria para mascotas. App para Android e iOS con panel web, del diseño a producción.",
        tags: ["Android", "iOS", "Panel web"],
        visualAlt: "Collage de interfaces de Vetsi",
      },
      wobber: {
        name: "Wobber",
        desc: "Red social para moteros: rutas, rodadas y comunidad sobre dos ruedas.",
        tags: ["Red social"],
        visualAlt: "Interfaz de Wobber",
      },
      glik: {
        name: "Glik",
        desc: "Autogestión de usuarios: roles, accesos e invitaciones sin depender de soporte.",
        tags: ["Web"],
        visualAlt: "Interfaz de Glik",
      },
      libre: {
        name: "Libre",
        desc: "Aplicación de servicio de transporte. Desarrollé las apps móviles con Ionic y parte del full-stack.",
        tags: ["Ionic", "Full-stack", "2023"],
        visualAlt: "Interfaz de Libre",
      },
    },
  },
  contact: {
    eyebrow: "Contacto",
    title: { before: "¡Hablemos de tu ", em: "próximo proyecto!" },
  },
} satisfies Content;
