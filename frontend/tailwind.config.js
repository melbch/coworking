/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ["'MuseoModerno'", "sans-serif"],
        display: ["'Tomorrow'", "sans-serif"],
      },
      colors: {
        primaryGreen: "#006B52",
        primaryPurple: "#5A1F8B",
        darkBg: "#030013",
        formBg: "#1C1F2A"
      }
    },
  },
  plugins: [],
}

