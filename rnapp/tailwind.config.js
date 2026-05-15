// Consumes the shared canonical tokens — same source the web app uses.
// Color values come from CSS variables in global.css (generated from tokens.js).
const tokens = require("../design-tokens/tokens.js");

/** Every semantic color → its CSS variable, with alpha support for `/opacity`. */
const colors = Object.fromEntries(
  Object.keys(tokens.colors.light).map((name) => [
    name,
    `hsl(var(--${name}) / <alpha-value>)`,
  ])
);

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors,
      borderRadius: {
        sm: `${tokens.radius.sm}px`,
        md: `${tokens.radius.md}px`,
        lg: `${tokens.radius.lg}px`,
        xl: `${tokens.radius.xl}px`,
      },
      // React Native has no font-weight→family resolution: each weight is its
      // own family. Use `font-sans` / `font-sans-medium` / `-semibold` / `-bold`.
      fontFamily: {
        sans: [tokens.fontFamily.sans.native.regular],
        "sans-medium": [tokens.fontFamily.sans.native.medium],
        "sans-semibold": [tokens.fontFamily.sans.native.semibold],
        "sans-bold": [tokens.fontFamily.sans.native.bold],
        mono: [tokens.fontFamily.mono.native.regular],
      },
      fontSize: Object.fromEntries(
        Object.entries(tokens.typography).map(([name, t]) => [
          name,
          [`${t.fontSize}px`, { lineHeight: `${t.lineHeight}px` }],
        ])
      ),
    },
  },
  plugins: [],
};
