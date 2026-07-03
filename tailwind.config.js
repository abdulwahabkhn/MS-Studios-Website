/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.html',
    './assets/js/*.js'
  ],
  theme: {
    extend: {
      colors: {
        ink: '#100e0b',
        charcoal: '#191511',
        espresso: '#231c16',
        porcelain: '#f5efe4',
        bone: '#e8ddca',
        champagne: '#d6b477',
        gold: '#b9833b',
        garnet: '#7c2f37',
        olive: '#56624b',
        smoke: '#8f887b'
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'monospace']
      },
      boxShadow: {
        luxe: '0 28px 80px rgba(16, 14, 11, 0.24)',
        glow: '0 18px 50px rgba(214, 180, 119, 0.18)'
      },
      backgroundImage: {
        'fine-noise': 'linear-gradient(135deg, rgba(245,239,228,0.06), rgba(214,180,119,0.04))'
      }
    }
  },
  plugins: []
};
