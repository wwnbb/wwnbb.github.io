/** @type {import('tailwindcss').Config} */
const { fontFamily } = require('tailwindcss/defaultTheme')
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', ...fontFamily.sans],
      },
      colors: {
        base03: '#002b36',
        base02: '#073642',
        base01: '#586e75',
        base00: '#657b83',
        base0: '#839496',
        base1: '#c9c4b5',
        base2: '#eee8d5',
        base3: '#fdf6e3',
        basebg: '#E1D5C9',
        sgray: '#93a1a1',
        syellow: '#b58900',
        sorange: '#cb4b16',
        sred: '#dc322f',
        smagenta: '#d33682',
        sviolet: '#6c71c4',
        sblue: '#268bd2',
        sdarkcyan: '#1C4D78',
        scyan: '#2aa198',
        sgreen: '#859900',
        codelightbg: '#D2C4B7',
        codedarkbg: '#00242d',
      },
      gridTemplateRows: {
        '12': 'repeat(12, minmax(0, 1fr))',
        '11-auto': 'repeat(11, 8.33vh) 1fr',
      },
      gridRow: {
        '8': '8',
        '9': '9',
        '10': '10',
        '11': '11',
        '12': '12',
        '13': '13',
      },
      gridRowStart: {
        '8': '8',
        '9': '9',
        '10': '10',
        '11': '11',
        '12': '12',
        '13': '13',
      },
      gridRowEnd: {
        '8': '8',
        '9': '9',
        '10': '10',
        '11': '11',
        '12': '12',
        '13': '13',
      },
      FontSize: {
        "12xl": "12rem",
      },
    },
  },
  plugins: [],
}
