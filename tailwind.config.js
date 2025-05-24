/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'spin-reverse': 'spin 6s linear reverse infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'gradient-x': 'gradient-x 15s ease infinite',
        'glitch-horizontal': 'glitch-horizontal 8s linear infinite',
        'glitch-horizontal-reverse': 'glitch-horizontal-reverse 12s linear infinite',
        'glitch-vertical': 'glitch-vertical 10s linear infinite',
        'glitch-vertical-reverse': 'glitch-vertical-reverse 15s linear infinite',
        'particle-1': 'particle-1 3s ease-in-out infinite',
        'particle-2': 'particle-2 4s ease-in-out infinite',
        'particle-3': 'particle-3 3.5s ease-in-out infinite',
        'particle-4': 'particle-4 4.5s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { 
            boxShadow: '0 0 10px rgba(6, 182, 212, 0.5), 0 0 20px rgba(6, 182, 212, 0.3)' 
          },
          '50%': { 
            boxShadow: '0 0 15px rgba(168, 85, 247, 0.5), 0 0 30px rgba(168, 85, 247, 0.3)' 
          },
        },
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}