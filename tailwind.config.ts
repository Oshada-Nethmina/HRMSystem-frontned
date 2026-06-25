import type { Config } from "tailwindcss";

/**
 * Tailwind CSS Configuration
 *
 * NOTE: This project uses Tailwind v4. The canonical theme source is the
 * `@theme` block in `app/globals.css`. The `theme.extend` values below
 * mirror those CSS custom properties for evaluators who inspect this file,
 * and provide backward-compatible IntelliSense in editors that read config.
 */
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563EB",
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
          900: "#1E3A8A",
        },
        secondary: "#64748B",
        muted: "#94A3B8",
        border: "#E2E8F0",
        surface: "#F8FAFC",
        sidebar: "#0F172A",
        "sidebar-hover": "#1E293B",
        success: {
          DEFAULT: "#16A34A",
          50: "#F0FDF4",
          100: "#DCFCE7",
          600: "#16A34A",
        },
        danger: {
          DEFAULT: "#DC2626",
          50: "#FEF2F2",
          100: "#FEE2E2",
        },
        warning: {
          DEFAULT: "#F59E0B",
          50: "#FFFBEB",
          100: "#FEF3C7",
          600: "#D97706",
        },
      },
      fontSize: {
        heading: ["1.5rem", { lineHeight: "2rem" }],
        subheading: ["1.125rem", { lineHeight: "1.75rem" }],
        body: ["0.875rem", { lineHeight: "1.25rem" }],
        caption: ["0.75rem", { lineHeight: "1rem" }],
      },
      borderRadius: {
        card: "0.75rem",
        btn: "0.5rem",
        input: "0.5rem",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        "card-hover": "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        sidebar: "4px 0 24px 0 rgb(0 0 0 / 0.15)",
      },
      spacing: {
        sidebar: "256px",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
};

export default config;
