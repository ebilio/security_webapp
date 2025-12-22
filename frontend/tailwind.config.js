/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cyberpunk color system
        cyber: {
          bg: {
            primary: '#0a0e27',     // Deep dark blue-black
            secondary: '#111827',    // Slightly lighter dark
            tertiary: '#1a1f3a',     // Card background
          },
          green: {
            50: '#e6fff0',
            100: '#b3ffd6',
            200: '#80ffbd',
            300: '#4dffa3',
            400: '#1aff8a',
            500: '#00ff41',          // Primary neon green (Matrix)
            600: '#00e63a',
            700: '#00cc33',
            800: '#00b32d',
            900: '#009926',
          },
          orange: {
            50: '#fff5f0',
            100: '#ffddd1',
            200: '#ffc4b0',
            300: '#ffab8f',
            400: '#ff926e',
            500: '#ff6b35',          // Accent orange
            600: '#ff5419',
            700: '#e63d00',
            800: '#cc3600',
            900: '#b32f00',
          },
          gray: {
            50: '#f8f9fa',
            100: '#e9ecef',
            200: '#dee2e6',
            300: '#ced4da',
            400: '#adb5bd',
            500: '#6c757d',
            600: '#495057',
            700: '#343a40',
            800: '#212529',
            900: '#0d1117',
          }
        },
        // Keep semantic colors but cyberpunk-themed
        primary: {
          50: '#e6fff0',
          100: '#b3ffd6',
          200: '#80ffbd',
          300: '#4dffa3',
          400: '#1aff8a',
          500: '#00ff41',
          600: '#00e63a',
          700: '#00cc33',
          800: '#00b32d',
          900: '#009926',
        },
        danger: {
          50: '#fff5f0',
          100: '#ffe4d9',
          200: '#ffcbb8',
          300: '#ffb097',
          400: '#ff9576',
          500: '#ff6b35',
          600: '#ff5419',
          700: '#e63d00',
          800: '#cc3600',
          900: '#b32f00',
        },
        success: {
          50: '#e6fff0',
          100: '#b3ffd6',
          200: '#80ffbd',
          300: '#4dffa3',
          400: '#1aff8a',
          500: '#00ff41',
          600: '#00e63a',
          700: '#00cc33',
          800: '#00b32d',
          900: '#009926',
        },
        warning: {
          50: '#fff5f0',
          100: '#ffddd1',
          200: '#ffc4b0',
          300: '#ffab8f',
          400: '#ff926e',
          500: '#ff6b35',
          600: '#ff5419',
          700: '#e63d00',
          800: '#cc3600',
          900: '#b32f00',
        }
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'mono': ['Share Tech Mono', 'monospace'],
      },
      boxShadow: {
        'neon-green': '0 0 5px #00ff41, 0 0 10px #00ff41, 0 0 15px #00ff4166',
        'neon-green-lg': '0 0 10px #00ff41, 0 0 20px #00ff41, 0 0 30px #00ff4166',
        'neon-orange': '0 0 5px #ff6b35, 0 0 10px #ff6b35, 0 0 15px #ff6b3566',
        'neon-orange-lg': '0 0 10px #ff6b35, 0 0 20px #ff6b35, 0 0 30px #ff6b3566',
        'cyber': '0 4px 20px rgba(0, 255, 65, 0.15)',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scan 2s linear infinite',
      },
      keyframes: {
        glow: {
          'from': {
            boxShadow: '0 0 5px #00ff41, 0 0 10px #00ff41',
          },
          'to': {
            boxShadow: '0 0 10px #00ff41, 0 0 20px #00ff41, 0 0 30px #00ff4166',
          }
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        }
      },
    },
  },
  plugins: [],
}
