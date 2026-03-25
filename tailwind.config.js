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
        'surface-primary': 'var(--surface-primary)',
        'surface-secondary': 'var(--surface-secondary)',
        'border-subtle': 'var(--border-subtle)',
        'brand-accent': 'var(--accent)',
      },
      backgroundColor: {
        'glass': 'rgba(255,255,255,0.05)',
      },
      borderColor: {
        'glass': 'rgba(255,255,255,0.1)',
      },
      fontSize: {
        'display': ['clamp(2.75rem, 8vw, 5.5rem)', { lineHeight: '0.95' }],
        'section-title': ['clamp(1.75rem, 4vw, 2.5rem)', { lineHeight: '1.1' }],
        'section-subtitle': ['clamp(1.125rem, 2vw, 1.5rem)', { lineHeight: '1.35' }],
        'body-md': ['1rem', { lineHeight: '1.7' }],
        'body-sm': ['0.9375rem', { lineHeight: '1.65' }],
      },
      spacing: {
        'space-1': '0.25rem',
        'space-2': '0.375rem',
        'space-3': '0.5rem',
        'space-4': '0.75rem',
        'space-5': '1rem',
        'space-6': '1.5rem',
        'space-7': '2rem',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
