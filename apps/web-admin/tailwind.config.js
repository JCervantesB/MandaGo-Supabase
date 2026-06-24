/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2e85aa',
          foreground: '#ffffff',
        },
        accent: {
          DEFAULT: '#ff8e00',
          foreground: '#ffffff',
        },
        background: '#f8fafc',
        surface: '#ffffff',
        'surface-muted': '#f1f5f9',
        border: '#e2e8f0',
        text: '#0f172a',
        'text-secondary': '#64748b',
        danger: '#ef4444',
        success: '#22c55e',
      },
    },
  },
  plugins: [],
};
