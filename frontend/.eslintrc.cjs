module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
  
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  
    "@typescript-eslint/semi": ["error"],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/restrict-template-expressions": "off",
    "@typescript-eslint/restrict-plus-operands": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
   
    "@typescript-eslint/no-unused-vars": [
      "error",
      { "argsIgnorePattern": "^_" }
    ],
  
    "no-case-declarations": "off",
    indent: ['error', 2],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],

    // disallow == and != // use === and !== instead
    eqeqeq: 'error',

    // disallow trailing whitespace at the end of lines
    'no-trailing-spaces': 'error',

    // enforce consistent spacing inside braces
    'object-curly-spacing': ['error', 'always'],

    // enforce consistent spacing before and after the arrow in arrow functions
    'arrow-spacing': ['error', { before: true, after: true }],

    // allow console.log() disallowed in 'eslint:recommended'
    'no-console': 0,

    'import/no-extraneous-dependencies': 0,
  },
}
