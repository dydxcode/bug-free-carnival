/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}', './lib/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0B0D12',
        panel: '#12151D',
        card: '#191D27',
        border: '#292E3A',
        text: '#F5F6FA',
        muted: '#9CA3B4',
        primary: '#8B5CF6',
        accent: '#A78BFA',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(139, 92, 246, 0.35), 0 12px 30px rgba(139, 92, 246, 0.2)',
      },
      backgroundImage: {
        hero: 'radial-gradient(circle at top, rgba(139, 92, 246, 0.22), transparent 35%)',
      },
    },
  },
  plugins: [],
};
