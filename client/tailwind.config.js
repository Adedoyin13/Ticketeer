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
      animation: {
        pop: "popIn 0.4s ease-out",
        "bounce-slow": "bounceSlow 2.2s infinite",
        "pulse-glow": "glowPulse 2.5s ease-in-out infinite",
      },
      keyframes: {
        popIn: {
          "0%": { transform: "scale(0.9)", opacity: 0 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
        bounceSlow: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        glowPulse: {
          "0%, 100%": { opacity: 0.4, transform: "scale(1)" },
          "50%": { opacity: 0.8, transform: "scale(1.15)" },
        },
      },
      keyframes: {
        'fade-in-out': {
          '0%': { opacity: '0' },
          '20%': { opacity: '1' },
          '80%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'bounce-in': {
          '0%': {
            opacity: '0',
            transform: 'scale(0.5) translateY(-20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1) translateY(0)',
          },
        },
      },
      animation: {
        'fade-in-out': 'fade-in-out 2.5s ease-in-out forwards',
        'bounce-in': 'bounce-in 0.8s ease-out',
      },
      keyframes: {
        'zoom-fade-in': {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'text-slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'zoom-fade-in': 'zoom-fade-in 0.8s ease-out forwards',
        'text-slide-up': 'text-slide-up 0.6s ease-out forwards',
      },
      keyframes: {
        successFadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pop: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
        },
      },
      animation: {
        successFadeInUp: 'successFadeInUp 0.6s ease-out forwards',
        pop: 'pop 1s ease-in-out infinite',
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
