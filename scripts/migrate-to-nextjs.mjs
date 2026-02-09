import { readdirSync, mkdirSync, copyFileSync, statSync, existsSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';

const root = '/vercel/share/v0-project';
const srcDir = join(root, 'src');

// Step 1: Copy all directories from src/ to root
const dirsToCopy = ['components', 'hooks', 'services', 'integrations', 'types', 'pages'];

function copyDirRecursive(src, dest) {
  if (!existsSync(src)) return;
  const entries = readdirSync(src, { withFileTypes: true });
  mkdirSync(dest, { recursive: true });
  
  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      mkdirSync(dirname(destPath), { recursive: true });
      copyFileSync(srcPath, destPath);
      console.log(`Copied: ${entry.name} -> ${destPath.replace(root + '/', '')}`);
    }
  }
}

for (const dir of dirsToCopy) {
  const srcPath = join(srcDir, dir);
  const destPath = join(root, dir);
  if (existsSync(srcPath)) {
    console.log(`\nCopying ${dir}/...`);
    copyDirRecursive(srcPath, destPath);
  }
}

// Also copy lib/utils.ts if not already at root
const srcLib = join(srcDir, 'lib', 'utils.ts');
const destLib = join(root, 'lib', 'utils.ts');
if (existsSync(srcLib)) {
  mkdirSync(dirname(destLib), { recursive: true });
  copyFileSync(srcLib, destLib);
  console.log(`Copied: lib/utils.ts`);
}

console.log('\nAll src/ files copied to root level.');
console.log('Migration complete!');
