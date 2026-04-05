import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          DEFAULT: "var(--purple)",
          light: "var(--purple-light)",
          soft: "var(--purple-soft)",
          dark: "var(--purple-dark)",
        },
        textMain: {
          dark: "var(--text-dark)",
          mid: "var(--text-mid)",
          soft: "var(--text-soft)",
        },
        redAlert: {
          DEFAULT: "var(--red)",
          soft: "var(--red-soft)",
        },
        blueDiamond: "var(--blue-diamond)",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
export default config;
