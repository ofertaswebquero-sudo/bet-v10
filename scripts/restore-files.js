import { execSync } from 'child_process';
import { mkdirSync, writeFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';

const PROJECT_ROOT = '/vercel/share/v0-project';
const GIT_DIR = join(PROJECT_ROOT, '.git');

// Use --git-dir to specify the git directory explicitly
const gitCmd = `git --git-dir=${GIT_DIR} --work-tree=${PROJECT_ROOT}`;

try {
  // Get all tracked files in git under src/
  const gitFiles = execSync(`${gitCmd} ls-tree -r HEAD --name-only`, { encoding: 'utf-8' })
    .trim()
    .split('\n')
    .filter(f => f.startsWith('src/'));

  console.log(`Found ${gitFiles.length} files in git under src/`);

  let restored = 0;
  let alreadyExist = 0;
  let errors = 0;

  for (const file of gitFiles) {
    const fullPath = join(PROJECT_ROOT, file);
    try {
      // Check if file physically exists on disk
      if (existsSync(fullPath)) {
        alreadyExist++;
        continue;
      }

      // Get file content from git
      const content = execSync(`${gitCmd} show HEAD:${file}`, { encoding: 'utf-8' });
      
      // Ensure directory exists
      const dir = dirname(fullPath);
      mkdirSync(dir, { recursive: true });
      
      // Write file
      writeFileSync(fullPath, content, 'utf-8');
      restored++;
      console.log(`Restored: ${file}`);
    } catch (err) {
      errors++;
      console.error(`Error restoring ${file}: ${err.message}`);
    }
  }

  console.log(`\nDone! Restored: ${restored}, Already existed: ${alreadyExist}, Errors: ${errors}`);
} catch (err) {
  console.error('Fatal error:', err.message);
  
  // Fallback: try git checkout
  console.log('\nTrying fallback: git checkout...');
  try {
    execSync(`${gitCmd} checkout HEAD -- src/`, { encoding: 'utf-8', cwd: PROJECT_ROOT });
    console.log('Successfully checked out src/ from git!');
  } catch (err2) {
    console.error('Fallback also failed:', err2.message);
  }
}
