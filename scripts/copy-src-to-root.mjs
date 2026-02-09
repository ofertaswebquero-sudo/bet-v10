import { readdirSync, mkdirSync, copyFileSync, statSync } from 'fs';
import { join, dirname } from 'path';

const srcDir = '/vercel/share/v0-project/src';
const rootDir = '/vercel/share/v0-project';

// Directories to copy from src/ to root
const dirsToCopy = [
  'components',
  'hooks',
  'services',
  'integrations',
  'types',
  'lib',
  'pages',
];

function copyDirRecursive(src, dest) {
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
      console.log(`Copied: ${srcPath} -> ${destPath}`);
    }
  }
}

for (const dir of dirsToCopy) {
  const srcPath = join(srcDir, dir);
  const destPath = join(rootDir, dir);
  
  try {
    statSync(srcPath);
    console.log(`\nCopying ${dir}/...`);
    copyDirRecursive(srcPath, destPath);
  } catch (e) {
    console.log(`Skipping ${dir}/ (does not exist)`);
  }
}

console.log('\nDone! All files copied from src/ to root.');
