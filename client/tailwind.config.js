/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#f8fafc',
        surface: '#ffffff',
        borderline: '#cbd5e1',
        primary: {
          DEFAULT: '#0369a1',
          hover: '#0284c7',
          active: '#075985',
          light: '#e0f2fe'
        },
        laser: {
          DEFAULT: '#dc2626',
          hover: '#b91c1c',
          light: '#fef2f2'
        },
        charcoal: {
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
          600: '#475569',
          500: '#64748b'
        }
      },
      borderRadius: {
        DEFAULT: '4px',
        sm: '4px',
        md: '6px',
        lg: '6px',
        xl: '6px',
        '2xl': '6px',
        '3xl': '6px'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'Menlo', 'monospace']
      }
    },
  },
  plugins: [],
}
