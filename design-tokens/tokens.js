// @ts-check
/**
 * Dealer Report — canonical design tokens.
 *
 * Single source of truth for BOTH apps:
 *   - web   (Next.js 16 / Tailwind v4)      consumes the generated `src/app/tokens.css`
 *   - rnapp (Expo 54 / NativeWind v4)       consumes the generated `rnapp/global.css`
 *                                           + `rnapp/lib/theme.ts`
 *
 * Plain CommonJS so the generator and the RN Tailwind config can read it with
 * zero transpile setup. Colors are HSL-channel triplets ("H S% L%") — the
 * shadcn convention — so opacity modifiers (`bg-primary/50`) work on web and
 * NativeWind alike.
 *
 * After editing this file, run:  node design-tokens/build-theme.mjs
 * (also runs automatically via each app's predev/prebuild/prestart script).
 */

/** @typedef {Record<string, string>} ColorMap */

/** Light + dark color palettes — shadcn "neutral" base, black-and-white theme. */
const colors = {
  /** @type {ColorMap} */
  light: {
    background: "0 0% 100%",
    foreground: "0 0% 0%", // pure black body text (per brand decision)
    card: "0 0% 100%",
    "card-foreground": "0 0% 0%",
    popover: "0 0% 100%",
    "popover-foreground": "0 0% 0%",
    primary: "0 0% 9%",
    "primary-foreground": "0 0% 98%",
    secondary: "0 0% 96.1%",
    "secondary-foreground": "0 0% 9%",
    muted: "0 0% 96.1%",
    "muted-foreground": "0 0% 45.1%",
    accent: "0 0% 96.1%",
    "accent-foreground": "0 0% 9%",
    destructive: "0 84.2% 60.2%",
    "destructive-foreground": "0 0% 98%",
    // Dealer Report extensions — reporting needs paid / due / stock states.
    success: "142 71% 45%",
    "success-foreground": "0 0% 98%",
    warning: "38 92% 50%",
    "warning-foreground": "0 0% 9%",
    border: "0 0% 89.8%",
    input: "0 0% 89.8%",
    ring: "0 0% 3.9%",
    // Sidebar (standard shadcn set — for the eventual B2B nav shell).
    sidebar: "0 0% 98%",
    "sidebar-foreground": "0 0% 0%",
    "sidebar-primary": "0 0% 9%",
    "sidebar-primary-foreground": "0 0% 98%",
    "sidebar-accent": "0 0% 96.1%",
    "sidebar-accent-foreground": "0 0% 9%",
    "sidebar-border": "0 0% 89.8%",
    "sidebar-ring": "0 0% 3.9%",
  },
  /** @type {ColorMap} */
  dark: {
    background: "0 0% 3.9%",
    foreground: "0 0% 98%",
    card: "0 0% 3.9%",
    "card-foreground": "0 0% 98%",
    popover: "0 0% 3.9%",
    "popover-foreground": "0 0% 98%",
    primary: "0 0% 98%",
    "primary-foreground": "0 0% 9%",
    secondary: "0 0% 14.9%",
    "secondary-foreground": "0 0% 98%",
    muted: "0 0% 14.9%",
    "muted-foreground": "0 0% 63.9%",
    accent: "0 0% 14.9%",
    "accent-foreground": "0 0% 98%",
    destructive: "0 62.8% 30.6%",
    "destructive-foreground": "0 0% 98%",
    success: "142 71% 45%",
    "success-foreground": "0 0% 98%",
    warning: "38 92% 50%",
    "warning-foreground": "0 0% 9%",
    border: "0 0% 14.9%",
    input: "0 0% 14.9%",
    ring: "0 0% 83.1%",
    sidebar: "0 0% 3.9%",
    "sidebar-foreground": "0 0% 98%",
    "sidebar-primary": "0 0% 98%",
    "sidebar-primary-foreground": "0 0% 9%",
    "sidebar-accent": "0 0% 14.9%",
    "sidebar-accent-foreground": "0 0% 98%",
    "sidebar-border": "0 0% 14.9%",
    "sidebar-ring": "0 0% 83.1%",
  },
};

/** Corner radii, in px. */
const radius = { sm: 6, md: 8, lg: 10, xl: 14, full: 9999 };

/**
 * Font families.
 *  - `web`    : CSS font stack (next/font exposes the `--font-geist-*` vars).
 *  - `native` : exact family names loaded from @expo-google-fonts in App.tsx.
 */
const fontFamily = {
  sans: {
    web: ["var(--font-geist-sans)", "Geist", "ui-sans-serif", "system-ui", "sans-serif"],
    native: {
      regular: "Geist_400Regular",
      medium: "Geist_500Medium",
      semibold: "Geist_600SemiBold",
      bold: "Geist_700Bold",
    },
  },
  mono: {
    web: ["var(--font-geist-mono)", "'Geist Mono'", "ui-monospace", "SFMono-Regular", "monospace"],
    native: { regular: "GeistMono_400Regular" },
  },
};

const fontWeight = { regular: 400, medium: 500, semibold: 600, bold: 700 };

/** Semantic type scale — size / lineHeight in px, weight unitless. */
const typography = {
  display: { fontSize: 30, lineHeight: 36, fontWeight: 600 },
  title: { fontSize: 24, lineHeight: 32, fontWeight: 600 },
  heading: { fontSize: 20, lineHeight: 28, fontWeight: 600 },
  subheading: { fontSize: 16, lineHeight: 24, fontWeight: 600 },
  body: { fontSize: 14, lineHeight: 20, fontWeight: 400 },
  label: { fontSize: 13, lineHeight: 16, fontWeight: 500 },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: 400 },
};

/**
 * Elevation. `web` is a CSS box-shadow string; `native` is the RN style object
 * (iOS shadow* props + Android elevation).
 */
const shadows = {
  xs: {
    web: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    native: { shadowColor: "#000000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  },
  sm: {
    web: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    native: { shadowColor: "#000000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  },
  md: {
    web: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    native: { shadowColor: "#000000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 4 },
  },
  lg: {
    web: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    native: { shadowColor: "#000000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 8 },
  },
};

/** Stacking order for layered UI. */
const zIndex = { dropdown: 1000, sticky: 1100, overlay: 1200, modal: 1300, popover: 1400, toast: 1500 };

/** Motion — durations in ms. */
const motion = {
  duration: { fast: 150, normal: 200, slow: 300 },
  easing: { standard: "cubic-bezier(0.2, 0, 0, 1)" },
};

module.exports = { colors, radius, fontFamily, fontWeight, typography, shadows, zIndex, motion };
