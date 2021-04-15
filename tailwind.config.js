const spacings = {
  header: '5rem',
  gutter: '19rem',
};

module.exports = {
  purge: [
    './src/pages/**/*.{js,jsx,ts,tsx}',
    './src/components/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: false, // or 'media' or 'class',
  theme: {
    colors: {
      black: '#000',
      white: '#FFF',
      gray: '#F4F5F7',
      border: '#E0E0E0',
      purple: '#704CD9',
    },
    fontFamily: {
      ubuntu: ['Ubuntu', 'sans-serif'],
    },
    extend: {
      spacing: {
        gutter: spacings.gutter,
      },
      height: {
        header: spacings.header,
      },
    },
  },
};
