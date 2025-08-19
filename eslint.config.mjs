import mantine from 'eslint-config-mantine';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  ...mantine,
  { ignores: ['**/*.{mjs,cjs,js,d.ts,d.mts}'] },
  {
    files: ['**/*.story.tsx'],
    rules: { 'no-console': 'off' },
  },
  {
    files: ['**/CreateBookmarklet.tsx'],
    rules: { 
      'no-script-url': 'off',
      'no-alert': 'off'
    },
  }
);
