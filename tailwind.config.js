/** @type {import('tailwindcss').Config} */
module.exports = {
  // ... existing config
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        // Professional slate colors
        slate: {
          950: '#0f172a',
          900: '#1e293b',
          800: '#334155',
          700: '#475569',
          600: '#64748b',
          500: '#94a3b8',
          400: '#cbd5e1',
          300: '#e2e8f0',
          200: '#f1f5f9',
          100: '#f8fafc',
          50: '#f9fafb',
        }
      },
    },
  },
}