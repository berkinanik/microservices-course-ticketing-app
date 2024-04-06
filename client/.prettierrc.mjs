/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').options} */
const config = {
  plugins: ['prettier-plugin-tailwindcss'],
  arrowParens: 'always',
  bracketSameLine: false,
  bracketSpacing: true,
  embeddedLanguageFormatting: 'auto',
  endOfLine: 'lf',
  htmlWhitespaceSensitivity: 'css',
  insertPragma: false,
  jsxSingleQuote: false,
  printWidth: 100,
  proseWrap: 'preserve',
  quoteProps: 'as-needed',
  requirePragma: false,
  semi: true,
  singleAttributePerLine: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  useTabs: false,
};

export default config;
