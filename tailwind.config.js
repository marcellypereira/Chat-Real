/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#4b5ae4',
        secondary: '#fcfdf2',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        whatsapp: '#25D366',
        'primary-light': '#dbe0ff',
        'primary-dark': '#3949c3',
        'text-primary': '#111827',
        'text-secondary': '#6b7280',
      },
      boxShadow: {
        chat: '0 4px 6px -1px rgba(75, 90, 228, 0.1), 0 2px 4px -1px rgba(75, 90, 228, 0.06)',
      },
    },
  },
  plugins: [],
};
