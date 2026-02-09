import { execSync } from 'child_process';
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import { dirname, join } from 'path';

const projectDir = '/vercel/share/v0-project';

try {
  // Try git checkout approach
  console.log('[v0] Attempting git checkout of all src/ files...');
  
  // List all tracked files in src/
  const gitFiles = execSync('git ls-files src/', { cwd: projectDir, encoding: 'utf-8' }).trim().split('\n');
  console.log(`[v0] Found ${gitFiles.length} tracked files in src/`);
  
  let materialized = 0;
  let alreadyExists = 0;
  let errors = 0;
  
  for (const file of gitFiles) {
    const fullPath = join(projectDir, file);
    
    if (existsSync(fullPath)) {
      alreadyExists++;
      continue;
    }
    
    try {
      // Get the file content from git
      const content = execSync(`git show HEAD:${file}`, { cwd: projectDir, encoding: 'utf-8' });
      
      // Ensure directory exists
      const dir = dirname(fullPath);
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }
      
      // Write file
      writeFileSync(fullPath, content);
      materialized++;
      console.log(`[v0] Materialized: ${file}`);
    } catch (e) {
      errors++;
      console.error(`[v0] Error with ${file}: ${e.message}`);
    }
  }
  
  console.log(`\n[v0] Summary:`);
  console.log(`  Already on disk: ${alreadyExists}`);
  console.log(`  Newly materialized: ${materialized}`);
  console.log(`  Errors: ${errors}`);
  console.log(`  Total tracked: ${gitFiles.length}`);
  
  // Also check root config files
  const rootFiles = ['index.html', 'vite.config.ts', 'tailwind.config.ts', 'tsconfig.json', 'tsconfig.app.json', 'tsconfig.node.json', 'postcss.config.js', 'eslint.config.js', 'components.json'];
  
  for (const file of rootFiles) {
    const fullPath = join(projectDir, file);
    if (!existsSync(fullPath)) {
      try {
        const content = execSync(`git show HEAD:${file}`, { cwd: projectDir, encoding: 'utf-8' });
        writeFileSync(fullPath, content);
        console.log(`[v0] Materialized root file: ${file}`);
      } catch (e) {
        // File might not exist in git
      }
    }
  }
  
} catch (e) {
  console.error('[v0] Git approach failed:', e.message);
  
  // Fallback: try to find where git stores the objects
  try {
    const gitDir = execSync('git rev-parse --git-dir', { cwd: projectDir, encoding: 'utf-8' }).trim();
    console.log('[v0] Git dir:', gitDir);
    const head = execSync('git rev-parse HEAD', { cwd: projectDir, encoding: 'utf-8' }).trim();
    console.log('[v0] HEAD:', head);
    const branch = execSync('git branch --show-current', { cwd: projectDir, encoding: 'utf-8' }).trim();
    console.log('[v0] Branch:', branch);
  } catch (e2) {
    console.error('[v0] Git not available:', e2.message);
  }
}
