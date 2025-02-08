/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
   daisyui: {
    themes: [
      {
        toobTheme: {
          primary: "#8B5CF6",

          secondary: "#14B8A6",

          accent: "#FFA400",

          neutral: "#C3DFE0",

          "base-100": "#1F2937",

          info: "#A297D1",

          success: "#00F038",

          warning: "#FFA400",

          error: "#f00000",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};

