export default {
  content: [
    './index.html',
    './index.tsx',
    './App.tsx',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        serif: ['Poppins', 'sans-serif'],
        mono: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: '#007BFF',
        'primary-dark': '#144EB6',
        'text-main': '#212529',
        'text-muted': '#6c757d',
        'bg-main': '#F8F9FA',
        'bg-card': '#FFFFFF',
        'border-subtle': '#E9ECEF',
        'accent-light': '#CCE1F5',
      }
    }
  },
  plugins: [],
}
