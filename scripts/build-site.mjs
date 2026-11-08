import path from 'node:path';
import { execFileSync } from 'node:child_process';
// Build public assets before Next/Vercel collects its static output.
await import('./build-search.mjs');
execFileSync(process.execPath, [path.resolve('node_modules/next/dist/bin/next'), 'build'], {
  stdio: 'inherit',
});
