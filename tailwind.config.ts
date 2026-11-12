module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}', './lib/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--background)', panel: 'var(--panel)', card: 'var(--card)', border: 'var(--border)',
        text: 'var(--text)', muted: 'var(--muted)', primary: 'var(--primary)', accent: 'var(--accent)',
      },
      boxShadow: { glow: '0 0 0 1px rgba(139, 92, 246, 0.35), 0 12px 30px rgba(139, 92, 246, 0.2)' },
      backgroundImage: { hero: 'radial-gradient(circle at top, rgba(139, 92, 246, 0.22), transparent 35%)' },
    },
  },
  plugins: [],
};
