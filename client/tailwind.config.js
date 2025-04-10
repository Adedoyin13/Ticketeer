/** @type {import('tailwindcss').Config} */
export default {
  important: true,
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
    theme: {
      extend: {
        fontFamily: {
          merriweather: ['Merriweather', 'serif'],
          cormorant: ['Cormorant Garamond', 'serif'],
          spectral: ['Spectral', 'serif'],
          lora: ['Lora', 'serif'],
          inter: ['Inter', 'sans-serif'],
          quicksand: ['Quicksand', 'sans-serif'],
          poppins: ['Poppins', 'sans-serif'],
          montserrat: ['Montserrat', 'sans-serif'],
        },
        backgroundImage: {
          eventImage: "url('src/assets/event-image.png')",
          heroBg: "url('src/assets/Hero-Bg.png')",
          eventLove: "url('src/assets/Event-love.png')",
          aboutShow: "url('src/assets/About-Show-Ticket.png')",
          aboutConference: "url('src/assets/About-Conference.png')",
          aboutCheer: "url('src/assets/About-Cheer.png')",
          customGradient: 'linear-gradient(to right, #FF9953, #5F37F4, #374957)'
        },      
        colors: {
          bgColor: '#FFF4ED',
          footerBg: '#0D519B',
        },
        screens: {
          'xxs': '200px',
          'xs': '400px',
          'sm': '640px',
          'md': '768px',
          'lg': '1024px',
          'xl': '1280px',
        }
      },
  },
  plugins: [require('tailwind-scrollbar-hide')],
}