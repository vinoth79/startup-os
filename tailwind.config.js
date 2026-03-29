/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Lexend Deca', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'xs': ['11px', '1.5'],
        'sm': ['13px', '1.55'],
        'base': ['14px', '1.6'],
        'lg': ['16px', '1.5'],
        'xl': ['18px', '1.4'],
        '2xl': ['22px', '1.3'],
        '3xl': ['28px', '1.2'],
      },
      colors: {
        base: 'var(--color-base)',
        elevated: 'var(--color-elevated)',
        panel: 'var(--color-panel)',
        card: {
          DEFAULT: 'var(--color-card)',
          hover: 'var(--color-card-hover)',
        },
        txt: {
          DEFAULT: 'var(--color-text)',
          2: 'var(--color-text-2)',
          3: 'var(--color-text-3)',
          4: 'var(--color-text-4)',
          5: 'var(--color-text-5)',
        },
        line: {
          DEFAULT: 'var(--color-border)',
          strong: 'var(--color-border-strong)',
          faint: 'var(--color-border-faint)',
        },
        overlay: 'var(--color-overlay)',
      },
    },
  },
  plugins: [],
}
