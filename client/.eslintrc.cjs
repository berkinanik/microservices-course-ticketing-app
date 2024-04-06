/** @type {import("eslint").Linter.Config} */
const config = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
  ],
  rules: {
    '@typescript-eslint/array-type': 'off',
    '@typescript-eslint/consistent-type-definitions': 'off',
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        prefer: 'type-imports',
        disallowTypeAnnotations: true,
        fixStyle: 'inline-type-imports',
      },
    ],
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-non-null-assertion': 'error',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        destructuredArrayIgnorePattern: '^_',
        ignoreRestSiblings: true,
      },
    ],
    '@typescript-eslint/no-misused-promises': [
      2,
      {
        checksVoidReturn: { attributes: false },
      },
    ],
    'import/no-duplicates': ['error', { 'prefer-inline': true }],
    'import/consistent-type-specifier-style': ['error', 'prefer-inline'],
    'import/order': [
      'error',
      {
        alphabetize: { order: 'asc', caseInsensitive: true },
        groups: ['builtin', 'external', 'internal', ['parent', 'sibling'], 'index'],
        pathGroups: [
          {
            pattern: '{react,react-dom/**}',
            group: 'external',
            position: 'before',
          },
          {
            pattern: '{next,next/**}',
            group: 'external',
            position: 'before',
          },
          {
            pattern:
              '{@next-auth,@next-auth/**,next-auth,next-auth/**,@trpc/**,@prisma/**,next-i18next,next-i18next/**}',
            group: 'external',
            position: 'before',
          },
        ],
        'newlines-between': 'always',
        pathGroupsExcludedImportTypes: ['builtin'],
      },
    ],
    eqeqeq: ['error', 'smart'],
    'newline-before-return': 'error',
    'no-console': 'warn',
    'no-var': 'error',
    'no-unreachable': 'error',
    'no-unused-vars': 'off',
    'no-useless-return': 'error',
    'prefer-const': 'error',
    'react/hook-use-state': 'error',
    'react/jsx-boolean-value': ['error', 'never'],
    'react/jsx-curly-brace-presence': [
      'error',
      { props: 'never', children: 'never', propElementValues: 'always' },
    ],
  },
};

module.exports = config;
