export default {
  '(apps|packages)/**/*.(ts|tsx|js)': () => ['yarn lint', 'yarn format'],
};
