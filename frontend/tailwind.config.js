/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Syne"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        ink: {
          DEFAULT: '#0f0e11',
          soft: '#1c1a21',
          muted: '#2d2a35',
        },
        chalk: {
          DEFAULT: '#f5f3f0',
          dim: '#c8c4be',
          faint: '#7a7570',
        },
        amber: {
          glow: '#f5a623',
          soft: '#fbbf5a',
          dim: '#7a5210',
        },
        jade: {
          DEFAULT: '#2dd4a0',
          soft: '#7eeacb',
          dim: '#1a7a5e',
        },
        coral: {
          DEFAULT: '#f5604a',
          soft: '#f99080',
          dim: '#7a2a1e',
        },
        violet: {
          task: '#a78bfa',
          soft: '#c4b5fd',
          dim: '#4c3494',
        },
      },
      boxShadow: {
        card: '0 0 0 1px rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.4)',
        glow: '0 0 20px rgba(245,166,35,0.15)',
        'glow-jade': '0 0 20px rgba(45,212,160,0.15)',
      },
      animation: {
        'fade-up': 'fadeUp 0.4s ease forwards',
        'fade-in': 'fadeIn 0.3s ease forwards',
        'slide-in': 'slideIn 0.3s ease forwards',
        shimmer: 'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: 0, transform: 'translateY(16px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        slideIn: {
          from: { opacity: 0, transform: 'translateX(-16px)' },
          to: { opacity: 1, transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
