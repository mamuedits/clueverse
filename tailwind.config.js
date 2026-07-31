/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#090D16',
        surface: {
          DEFAULT: '#121826',
          hover: '#1B2438',
          card: 'rgba(18, 24, 38, 0.75)',
        },
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
        },
        accent: {
          cyan: '#06b6d4',
          blue: '#3b82f6',
          emerald: '#10b981',
          rose: '#f43f5e',
          amber: '#f59e0b',
        }
      },
      backgroundImage: {
        'glow-gradient': 'radial-gradient(circle at 50% -20%, rgba(139, 92, 246, 0.25), rgba(9, 13, 22, 0))',
        'glass-card': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glow 2.5s infinite ease-in-out',
      },
      keyframes: {
        glow: {
          '0%, 100%': { opacity: '0.6', filter: 'drop-shadow(0 0 15px rgba(139, 92, 246, 0.4))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 25px rgba(59, 130, 246, 0.7))' },
        }
      }
    },
  },
  plugins: [],
}
