import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const require = createRequire(import.meta.url);
const serverRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function resolveOrNull(spec) {
  try {
    return require.resolve(spec, { paths: [serverRoot] });
  } catch {
    return null;
  }
}

const required = ['express', 'dotenv', 'cors', 'multer', '@supabase/supabase-js'];
const missing = required.filter((name) => !resolveOrNull(name));

if (missing.length > 0) {
  console.error('');
  console.error('  ReceiptIQ server: missing dependencies:', missing.join(', '));
  console.error('');
  console.error('  Fix: open a terminal in the ReceiptIQ project ROOT (folder that contains');
  console.error('       both "client" and "server"), then run:');
  console.error('');
  console.error('         npm install');
  console.error('');
  console.error('  Or from the server folder only:');
  console.error('');
  console.error('         cd server');
  console.error('         npm install');
  console.error('');
  process.exit(1);
}
