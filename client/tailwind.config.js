/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        "on-secondary-fixed-variant": "#515c70",
        "surface-tint": "#53ddfc",
        "primary-container": "#21bedc",
        "secondary-dim": "#cad5ed",
        "surface-dim": "#060e20",
        "secondary-fixed": "#d8e3fb",
        "surface-container": "#0f1930",
        "primary": "#53ddfc",
        "on-secondary": "#475266",
        "on-error-container": "#ffa8a3",
        "surface-bright": "#1f2b49",
        "on-surface": "#dee5ff",
        "background": "#060e20",
        "outline": "#6d758c",
        "error": "#ff716c",
        "on-tertiary-fixed": "#004a1d",
        "secondary-fixed-dim": "#cad5ed",
        "on-primary-fixed": "#003640",
        "secondary": "#d8e3fb",
        "tertiary": "#c5ffc9",
        "on-primary": "#004b58",
        "on-background": "#dee5ff",
        "surface-variant": "#192540",
        "error-container": "#9f0519",
        "surface-container-high": "#141f38",
        "tertiary-dim": "#5bf083",
        "inverse-on-surface": "#4d556b",
        "on-primary-container": "#00343e",
        "surface-container-lowest": "#000000",
        "on-tertiary-container": "#005f28",
        "inverse-primary": "#00687b",
        "on-surface-variant": "#a3aac4",
        "on-secondary-container": "#c5d1e8",
        "on-tertiary-fixed-variant": "#006a2d",
        "inverse-surface": "#faf8ff",
        "primary-fixed-dim": "#40ceed",
        "error-dim": "#d7383b",
        "tertiary-fixed": "#6bff8f",
        "on-error": "#490006",
        "tertiary-container": "#6bff8f",
        "on-primary-fixed-variant": "#005564",
        "surface-container-highest": "#192540",
        "surface-container-low": "#091328",
        "secondary-container": "#3c475a",
        "tertiary-fixed-dim": "#5bf083",
        "primary-dim": "#40ceed",
        "primary-fixed": "#53ddfc",
        "on-tertiary": "#00692c",
        "surface": "#060e20",
        "on-secondary-fixed": "#354053",
        "outline-variant": "#40485d"
      },
      fontFamily: {
        "headline": ["Space Grotesk"],
        "body": ["Inter"],
        "label": ["Inter"]
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      boxShadow: {
        'header': '0px 24px 48px -12px rgba(0,104,123,0.12)',
        'card': '0px 24px 48px -12px rgba(0,104,123,0.12)',
        'glow': '0_0_20px_rgba(83,221,252,0.3)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        }
      }
    },
  },
  plugins: [],
}
