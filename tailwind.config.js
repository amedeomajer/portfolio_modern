/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        bricolage: ['var(--font-bricolage)', 'sans-serif'],
        syne: ['var(--font-syne)', 'sans-serif'],
      },
      colors: {
        'bg-black': '#0a0a0a',
        'bg-dark': '#141414',
        'bg-card': '#1a1a1a',
        'text-primary': '#ffffff',
        'text-muted': '#a0a0a0',
      },
      backgroundColor: {
        'glass': 'rgba(255,255,255,0.05)',
      },
      borderColor: {
        'glass': 'rgba(255,255,255,0.1)',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
