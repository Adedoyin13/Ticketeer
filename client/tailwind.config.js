/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  important: true,
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        merriweather: ["Merriweather", "serif"],
        cormorant: ["Cormorant Garamond", "serif"],
        spectral: ["Spectral", "serif"],
        lora: ["Lora", "serif"],
        inter: ["Inter", "sans-serif"],
        quicksand: ["Quicksand", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
      },
      backgroundImage: {
        eventImage: "url('src/assets/event-image.png')",
        heroBg: "url('src/assets/Hero-Bg.png')",
        eventLove: "url('src/assets/Event-love.png')",
        aboutShow: "url('src/assets/About-Show-Ticket.png')",
        aboutConference: "url('src/assets/About-Conference.png')",
        aboutCheer: "url('src/assets/About-Cheer.png')",
        customGradient: "linear-gradient(to right, #FF9953, #5F37F4, #374957)",
      },
      colors: {
        bgColor: "#FFF4ED",
        footerBg: "#0D519B",
      },
      screens: {
        xxs: "200px",
        xs: "400px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
      },
      color: {
        background: {
          DEFAULT: "var(--color-background)",
        },
        surface: {
          DEFAULT: "var(--color-surface)",
        },
        text: {
          base: "var(--color-text)",
          muted: "var(--color-text-muted)",
        },
        accent: {
          DEFAULT: "#EA670C",
          hover: "#d85c0b",
        },
      },
      keyframes: {
        fadeInOut: {
          "0%": { opacity: 0 },
          "20%": { opacity: 1, transform: "scale(1)" },
          "80%": { opacity: 1, transform: "scale(1)" },
          "100%": { opacity: 0, transform: "scale(0.95)" },
        },
        bounceIn: {
          "0%": { transform: "scale(0.5)", opacity: 0 },
          "60%": { transform: "scale(1.05)", opacity: 1 },
          "80%": { transform: "scale(0.95)" },
          "100%": { transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
