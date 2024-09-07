export default {
  '(apps|packages)/**/*.(ts|tsx|js|mjs|cjs)': () => [
    'yarn lint',
    'yarn format',
  ],
};
