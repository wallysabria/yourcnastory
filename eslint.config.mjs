import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  globalIgnores([
    '.next/**',
    '_source/**',
    'docs/**',
    'public/**',
    'next-env.d.ts',
    'scripts/audit.mjs',
    'scripts/enrich-audit.mjs',
    'scripts/finalize-audit.mjs',
    'scripts/validate-audit.mjs',
    'scripts/image-metadata.mjs',
  ]),
]);
