import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        "spin-slow": "spin 2s linear infinite",
      },
      screens: {
        sm: { max: "640px" },
        md: { min: "641px", max: "1024px" },
        lg: { min: "1025px" },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      width: {
        "1920": "1920px",
      },
      height: {
        "1080": "1080px",
      },
      fontFamily: {
        sans: ["Pretendard", "ui-sans-serif", "system-ui"],
      },
      colors: {
        primary: {
          50: "#FFDECC",
          100: "#FFBE99",
          200: "#FF9D66",
          300: "#FF7C33",
          400: "#FF5C00",
          500: "#CC4900",
          600: "#993700",
          700: "#662500",
          800: "#331200",
          900: "#000000",
        },
        secondary: {
          50: "#D3DCFD",
          100: "#A2B6FB",
          200: "#718FF9",
          300: "#4068F7",
          400: "#0F42F5",
          500: "#0933C9",
          600: "#062799",
          700: "#041A67",
          800: "#020E36",
          900: "#000105",
        },
        third: {
          50: "#D4FCED",
          100: "#A4FADA",
          200: "#73F7C6",
          300: "#43F4B2",
          400: "#13F19E",
          500: "#0CC580",
          600: "#099561",
          700: "#066642",
          800: "#033522",
          900: "#000503",
        },
        grey: {
          50: "#FFFFFF",
          100: "#E6E6E6",
          200: "#CCCCCC",
          300: "#B3B3B3",
          400: "#999999",
          500: "#808080",
          600: "#666666",
          700: "#4D4D4D",
          800: "#333333",
          900: "#1A1A1A",
        },
      },
    },
  },

  plugins: [],
};
export default config;
