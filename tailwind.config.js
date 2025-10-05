/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Neobrutalism color palette
        primary: {
          50: "#fef3c7",
          100: "#fde68a",
          200: "#fcd34d",
          300: "#fbbf24",
          400: "#f59e0b",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
        },
        brutal: {
          yellow: "#FFD93D",
          pink: "#FF6B9D",
          beige: "#F5E6D3",
          cream: "#FFF4E0",
          blue: "#6BCF7F",
          green: "#6BCF7F",
          orange: "#FF8C42",
          purple: "#A78BFA",
          red: "#EF4444",
        },
        success: {
          50: "#f0fdf4",
          100: "#dcfce7",
          500: "#22c55e",
          600: "#16a34a",
        },
        warning: {
          50: "#fffbeb",
          100: "#fef3c7",
          500: "#f59e0b",
          600: "#d97706",
        },
        error: {
          50: "#fef2f2",
          100: "#fee2e2",
          500: "#ef4444",
          600: "#dc2626",
        },
      },
      boxShadow: {
        brutal: "4px 4px 0px 0px #000",
        "brutal-lg": "6px 6px 0px 0px #000",
        "brutal-xl": "8px 8px 0px 0px #000",
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: ["Space Mono", "Courier New", "monospace"],
      },
    },
  },
  plugins: [],
};
