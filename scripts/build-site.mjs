import path from 'node:path';
import { execFileSync } from 'node:child_process';
execFileSync(process.execPath, [path.resolve('node_modules/next/dist/bin/next'), 'build'], {
  stdio: 'inherit',
});
await import('./build-search.mjs');
