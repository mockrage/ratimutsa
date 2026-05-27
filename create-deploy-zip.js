const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function createDeployment() {
  const skipZip = process.argv.includes('--no-zip');
  const zipFile = 'DEPLOY_READY.zip';
  console.log(`--- Starting ${skipZip ? 'Git-Ready' : 'Zero-Install Package'} Deployment Build ---`);

  try {
    // 1. Clean old artifacts
    if (fs.existsSync(zipFile)) fs.unlinkSync(zipFile);
    if (fs.existsSync('.next/cache')) fs.rmSync('.next/cache', { recursive: true, force: true });
    
    // 2. Build app
    console.log('Running npm run build...');
    execSync('npm run build', { stdio: 'inherit' });

    // 3. Prepare Standalone Bundle
    console.log('Preparing standalone bundle...');
    const standaloneDir = path.join('.next', 'standalone');
    
    if (!fs.existsSync(standaloneDir)) {
      throw new Error('Standalone build failed or is not enabled in next.config.js');
    }

    // Next.js standalone folder needs public and static assets copied manually
    console.log('Copying static assets into standalone folder...');
    const targetStatic = path.join(standaloneDir, '.next', 'static');
    const targetPublic = path.join(standaloneDir, 'public');
    
    if (!fs.existsSync(path.join(standaloneDir, '.next'))) fs.mkdirSync(path.join(standaloneDir, '.next'), { recursive: true });
    
    // Copy public dir
    execSync(`powershell -Command "Copy-Item -Path 'public' -Destination '${targetPublic}' -Recurse -Force"`);
    // Copy static dir
    execSync(`powershell -Command "Copy-Item -Path '.next/static' -Destination '${targetStatic}' -Recurse -Force"`);
    
    // Copy prisma schema and seed (standalone doesn't include them by default)
    execSync(`powershell -Command "Copy-Item -Path 'prisma' -Destination '${standaloneDir}' -Recurse -Force"`);

    // Copy .env.example
    execSync(`powershell -Command "Copy-Item -Path '.env.example' -Destination '${standaloneDir}/.env.example' -Force"`);

    // Copy package.json
    execSync(`powershell -Command "Copy-Item -Path 'package.json' -Destination '${standaloneDir}/package.json' -Force"`);

    // Also copy server.js into standalone folder to keep it self-contained
    execSync(`powershell -Command "Copy-Item -Path 'server.js' -Destination '${standaloneDir}/server.js' -Force"`);

    if (skipZip) {
      console.log('\n--- SUCCESS: Git-Ready Standalone Folder Prepared ---');
      console.log(`Files located in: ${standaloneDir}`);
      console.log('You can now push the contents of this folder to your cPanel directory via Git.');
    } else {
      // 4. Create ZIP from the standalone folder
      console.log(`Zipping standalone bundle into ${zipFile}...`);
      const psZipCommand = `Set-Location '${standaloneDir}'; Compress-Archive -Path * -DestinationPath '..\\..\\${zipFile}' -Force`;
      execSync(`powershell -Command "${psZipCommand}"`, { stdio: 'inherit' });
      console.log('\n--- SUCCESS: Zero-Install Package Ready ---');
      console.log(`File: ${zipFile}`);
    }

  } catch (err) {
    console.error('Build failed:', err);
    process.exit(1);
  }
}

createDeployment();
