module.exports = {
  env: {
    browser: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'prettier/@typescript-eslint', // Disables ESLint rules that would conflict with prettier
    'plugin:jest/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended', // Runs prettier with ESLint. Make sure this is always the last configuration in the extends array.
  ],
  rules: {
    semi: ['error', 'always'],
    quotes: ['error', 'single'],
  },
};
