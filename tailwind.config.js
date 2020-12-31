module.exports = {
  purge: [
    './src/pages/**/*.{js,jsx,ts,tsx}',
    './src/components/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: false, // or 'media' or 'class',
  theme: {
    colors: {
      black: '#000',
      white: '#FDFDFD',
      gray: '#F4F5F7',
      border: '#E0E0E0',
      red: '#EB5757',
    },
    fontFamily: {
      ubuntu: ['Ubuntu', 'sans-serif'],
    },
    extend: {
      spacing: {
        gutter: '19rem',
      },
      zIndex: {
        '-10': '-10',
      },
    },
  },
  variants: {
    extend: {
      margin: ['first'],
    },
  },
};
