import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

const DIST_DIR = 'dist';
const PAGES_DIR = 'src/pages';

function getModifiedFiles() {
  return new Promise((resolve, reject) => {
    exec('git diff --name-only HEAD', (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      const modifiedFiles = stdout.split('\n').filter(file => file.startsWith(PAGES_DIR));
      resolve(modifiedFiles);
    });
  });
}

async function incrementalBuild() {
  try {
    const modifiedFiles = await getModifiedFiles();

    if (modifiedFiles.length === 0) {
      console.log('No changes detected. Skipping build.');
      return;
    }

    console.log('Modified files:', modifiedFiles);

    // Remove old build artifacts for modified files
    modifiedFiles.forEach(file => {
      const relativePath = path.relative(PAGES_DIR, file);
      const outputPath = path.join(DIST_DIR, relativePath).replace(/\.astro$/, '');
      if (fs.existsSync(outputPath)) {
        fs.rmSync(outputPath, { recursive: true, force: true });
        console.log(`Removed old build artifact: ${outputPath}`);
      }
    });

    // Run Astro build
    exec('astro build', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error during build: ${error}`);
        return;
      }
      console.log(stdout);
      console.error(stderr);
      console.log('Incremental build completed successfully.');
    });
  } catch (error) {
    console.error('Error during incremental build:', error);
  }
}

incrementalBuild();