module.exports = {
  env: {
    'jest/globals': true,
    browser: true,
    commonjs: true,
    es2021: true,
  },
  root: true,
  extends: ['@react-native-community'],
  // plugins: [ 'jest' ],
  rules: {
    'no-console': 'off',
    indent: ['error', 2],
    'object-curly-spacing': ['error', 'always'],
    'react/require-default-props': ['error'],
    'react/default-props-match-prop-types': ['error'],
    'react/sort-prop-types': ['error'],
    'comma-spacing': ['error', { before: false, after: true }],
    'no-inline-styles': false,
    'array-bracket-spacing': ['always'],
  },
}
