import type { Content } from "./types";

/**
 * Traducción al inglés — I18N-6: borrador pendiente de revisión por Nairelys antes del deploy.
 * Los nombres propios no se traducen (I18N-5).
 */
export const en = {
  meta: {
    title: "Nairelys Hernández · Full-Stack Developer",
    description:
      "Full-stack developer based in Caracas, Venezuela. Eight years building web and mobile apps with React, Vue, Node, NestJS, Scala, Ionic and React Native.",
    ogAlt: "Nairelys Hernández, full-stack web and mobile developer",
    ogTagline: "Full-stack · Web + Mobile",
  },
  header: {
    langLabel: "Language",
  },
  nav: {
    label: "Panel navigation",
    panels: {
      inicio: "Home",
      "sobre-mi": "About",
      stack: "Stack",
      experiencia: "Experience",
      proyectos: "Projects",
      contacto: "Contact",
    },
    prev: "Previous panel",
    next: "Next panel",
    goTo: "Go to {panel}",
    announce: "Panel {n} of {total}: {panel}",
    hintPointer: "Scroll ↓",
    hintTouch: "Swipe up ↑",
  },
  hero: {
    eyebrow: "Profile · full-stack · 8 years",
    firstName: "Nairelys",
    lastName: "Hernández",
    lead: "From Scala microservices to apps people open every day. Eight years building products that feel alive.",
    ctaPrimary: "Let’s talk",
    ctaSecondary: "See projects",
    ring: "FULL-STACK ✦ WEB + MOBILE ✦ CARACAS, VE ✦ SINCE 2018 ✦ ",
    badge: "Available ✓",
    photoAlt: "Photo of Nairelys Hernández",
  },
  about: {
    eyebrow: "About me",
    title: { before: "Computer Engineer, ", em: "Universidad Simón Bolívar" },
    body: "Based in Caracas, Venezuela. I move from frontend to backend without friction, and I’m obsessed with every interaction having rhythm. I don’t write boring code.",
    stats: {
      years: "years · since 2018",
      teams: "teams",
      products: "products",
      platforms: "platforms",
    },
    chips: ["Caracas, VE", "Engineering", "Full-stack"],
  },
  stack: {
    eyebrow: "Stack",
    title: { before: "The tool changes, ", em: "I adapt" },
    aiLabel: "AI in my workflow",
    methodLabel: "Method",
    methodLead: "Spec-Driven Development:",
    methodBody: "specify → plan → implement with AI → verify.",
    srListLabel: "Technologies",
  },
  experience: {
    eyebrow: "Experience · 2018 — today",
    title: { before: "Seven teams, ", em: "eight years of rhythm" },
    details: {
      apps2go: "Microservices · Scala",
      libre: "Mobile · Ionic + full-stack",
      bp: "Vue.js + Express / Nest.js",
      cronapis: "Frontend · Angular",
      ipn: "Frontend · Angular",
      dbaccess: "Java · Oracle",
      ingenio: "Ionic + native Java",
    },
  },
  projects: {
    eyebrow: "Projects · {n} / 05",
    listLabel: "Projects",
    autoplayPause: "Pause tour",
    autoplayPlay: "Resume tour",
    items: {
      cuento: {
        name: "Tu voz, tu cuento",
        desc: "Creates stories from a child’s narration: they speak, and the app turns their voice into a story.",
        tags: ["App"],
        visualAlt:
          "Tu voz, tu cuento home screen: logo, title and the Create account and Start buttons",
      },
      vetsi: {
        name: "Vetsi",
        desc: "Primary healthcare for pets. Android and iOS app with a web dashboard, from design to production.",
        tags: ["Android", "iOS", "Web dashboard"],
        visualAlt: "Collage of Vetsi interfaces",
      },
      wobber: {
        name: "Wobber",
        desc: "A social network for bikers: routes, group rides and community on two wheels.",
        tags: ["Social network"],
        visualAlt: "Wobber interface",
      },
      glik: {
        name: "Glik",
        desc: "User self-management: roles, access and invitations without depending on support.",
        tags: ["Web"],
        visualAlt: "Glik interface",
      },
      libre: {
        name: "Libre",
        desc: "A transportation service app. I built the mobile apps with Ionic and part of the full stack.",
        tags: ["Ionic", "Full-stack", "2023"],
        visualAlt: "Libre interface",
      },
    },
  },
  contact: {
    eyebrow: "Contact",
    title: { before: "Let’s talk about your ", em: "next project!" },
  },
} satisfies Content;
