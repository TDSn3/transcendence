module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'airbnb',
    'airbnb/hooks',
    'airbnb-typescript',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'vite.config.ts'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  plugins: ['react-refresh', '@typescript-eslint'],
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
  
    // Allows declarations in case clauses.
    "no-case-declarations": "off",

    // Enforces 2-space indentation.
    indent: ['error', 2],

    // Enforces Unix line endings.
    'linebreak-style': ['error', 'unix'],

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

    // disables requiring React import in JSX files, unnecessary with React 17 and later.
    'react/react-in-jsx-scope': 'off',

    'import/no-extraneous-dependencies': 0,

    '@typescript-eslint/member-delimiter-style': ['error', {
      // Use commas for members on multiple lines
      multiline: {
        delimiter: 'comma',
        requireLast: true,
      },
      // Use commas for members on a single line
      singleline: {
        delimiter: 'comma',
        requireLast: false,
      },
    }],
  },
}
