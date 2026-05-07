import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ["'Cormorant Garamond'", "serif"],
        display: ["'Cinzel'", "serif"],
        script: ["'Dancing Script'", "cursive"],
        mono: ["'Space Mono'", "monospace"],
      },
      colors: {
        gold: "#f5c842",
        "cosmic-black": "#02020a",
      },
    },
  },
  plugins: [],
};
export default config;
