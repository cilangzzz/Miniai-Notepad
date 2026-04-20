/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{vue,js,ts,jsx,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        // Neo-Brutalist color system
        background: '#131313',
        surface: '#131313',
        'surface-lowest': '#0e0e0e',
        'surface-high': '#2a2a2a',
        'surface-highest': '#353535',
        primary: '#FFD700',
        secondary: '#007F7F',
        cyan: '#00f1ff',
        error: '#93000a',
        success: '#00a000',
        text: '#e2e2e2',
        'text-muted': '#666666',
      },
      fontFamily: {
        headline: ['Space Grotesk', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
      },
      borderWidth: {
        '4': '4px',
        '2': '2px',
      },
      borderRadius: {
        'none': '0px',
      },
      boxShadow: {
        'neo-black': '8px 8px 0px 0px rgba(0, 0, 0, 1)',
        'neo-white': '8px 8px 0px 0px rgba(255, 255, 255, 1)',
        'neo-gold': '8px 8px 0px 0px rgba(255, 215, 0, 1)',
        'neo-teal': '8px 8px 0px 0px rgba(0, 127, 127, 1)',
        'neo-small': '4px 4px 0px 0px rgba(0, 0, 0, 1)',
        'neo-hard': '6px 6px 0px 0px rgba(53, 53, 53, 1)',
        'neo-hover': '12px 12px 0px 0px rgba(0, 0, 0, 1)',
      },
      spacing: {
        '72': '72px',
        '88': '88px',
        '120': '120px',
      },
      screens: {
        'mobile': '768px',
        'tablet': '1024px',
      },
      skew: {
        '-1': '-1deg',
        '-2': '-2deg',
        '-3': '-3deg',
        '1': '1deg',
        '2': '2deg',
        '3': '3deg',
      },
      animation: {
        'spin-slow': 'spin 2s linear infinite',
      },
    },
  },
  plugins: [],
  // Disable default Tailwind prefix
  prefix: '',
  // Important for Neo-Brutalist design - no rounded corners by default
  corePlugins: {
    preflight: true,
  },
}