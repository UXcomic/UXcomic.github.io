/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    `./src/pages/**/*.{js,jsx,ts,tsx}`,
    `./src/components/**/*.{js,jsx,ts,tsx}`,
  ],
  theme: {
    extend: {
      colors: {
        'uxcomic-text-primary': 'rgba(55, 53, 47, 1)',
        'uxcomic-text-secondary': 'rgba(55, 53, 47, 0.75)',
        'uxcomic-text-tertiary': 'rgba(55, 53, 47, 0.5)',
        'uxcomic-text-disabled': 'rgba(55, 53, 47, 0.3)',
        'uxcomic-bg': 'rgba(247, 244, 238, 1)',
        'uxcomic-divider': 'rgba(218, 218, 218, 1)',
      },
      fontFamily: {
        'uxcomic-calistoga': ['Calistoga', 'serif'],
        'uxcomic-oi': ['Oi', 'serif'],
        'uxcomic-inter': ['Inter', 'sans-serif'],
      },
      fontSize: {
        'uxcomic-display-1': ['22px', { lineHeight: '32px' }],
        'uxcomic-footer': ['13px', { lineHeight: '20px' }],
        'uxcomic-card-title-small': ['11px', { lineHeight: '22px' }],
        'uxcomic-overline': ['11px', { lineHeight: '12px' }],
        'uxcomic-notion-h1': ['24px', { lineHeight: '32px' }],
        'uxcomic-notion-h2': ['20px', { lineHeight: '30px' }],
        'uxcomic-notion-body': ['16px', { lineHeight: '26px' }],
      },
    },
  },
  plugins: [],
}
