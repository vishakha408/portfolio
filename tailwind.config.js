/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          bg: "#0A0E17",       // near-black navy — the "embedding space"
          surface: "#121826",
          surface2: "#1A2235",
          border: "#232C42",
        },
        ink: {
          DEFAULT: "#E7EAF3",
          muted: "#8891A7",
          dim: "#5B647E",
        },
        spark: {
          amber: "#F2A94B",    // signal / answer accent
          violet: "#7C8CFF",   // vector / query accent
          green: "#4ADE80",    // "retrieved" tag accent
        },
      },
      fontFamily: {
        display: ["'JetBrains Mono'", "monospace"],
        body: ["'Inter'", "sans-serif"],
      },
      keyframes: {
        pulseDot: {
          "0%, 100%": { opacity: 0.4, transform: "scale(1)" },
          "50%": { opacity: 1, transform: "scale(1.4)" },
        },
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(12px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        pulseDot: "pulseDot 2.4s ease-in-out infinite",
        fadeUp: "fadeUp 0.6s ease-out both",
      },
    },
  },
  plugins: [],
};
