import { existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const PROJECT_ROOT = '/vercel/share/v0-project';

function listDir(dir, prefix = '') {
  try {
    const entries = readdirSync(dir);
    for (const entry of entries) {
      if (entry === 'node_modules' || entry === '.git') continue;
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        console.log(`${prefix}${entry}/`);
        listDir(fullPath, prefix + '  ');
      } else {
        console.log(`${prefix}${entry} (${stat.size} bytes)`);
      }
    }
  } catch (err) {
    console.error(`Error reading ${dir}: ${err.message}`);
  }
}

console.log('=== Project src/ directory ===');
const srcDir = join(PROJECT_ROOT, 'src');
if (existsSync(srcDir)) {
  listDir(srcDir);
} else {
  console.log('src/ directory does NOT exist!');
}

console.log('\n=== Root files ===');
try {
  const entries = readdirSync(PROJECT_ROOT);
  for (const entry of entries) {
    if (entry === 'node_modules' || entry === '.git') continue;
    const fullPath = join(PROJECT_ROOT, entry);
    const stat = statSync(fullPath);
    if (stat.isFile()) {
      console.log(`${entry} (${stat.size} bytes)`);
    } else if (stat.isDirectory()) {
      console.log(`${entry}/`);
    }
  }
} catch (err) {
  console.error(`Error: ${err.message}`);
}
