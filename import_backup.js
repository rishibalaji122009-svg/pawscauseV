const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const backupPath = path.join(__dirname, '../public/assets/aistudio/pawscause-backup-2026-10-31_d3ade521.json');

if (!fs.existsSync(backupPath)) {
  console.error('Backup file not found at:', backupPath);
  process.exit(1);
}

const data = fs.readFileSync(backupPath, 'utf8');
const parsed = JSON.parse(data);

// Ensure timestamp is present
parsed.updatedAt = new Date().toISOString();

const targets = [
  path.join(__dirname, '../pawscause_db.json'),
  path.join(__dirname, '../data/pawscause_db.json'),
  path.join(__dirname, '../public/pawscause_db.json')
];

targets.forEach(target => {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, JSON.stringify(parsed, null, 2), 'utf8');
  console.log('Successfully wrote data to:', target);
});

// Run generate_bundle.cjs if it exists
const bundleScript = path.join(__dirname, 'generate_bundle.cjs');
if (fs.existsSync(bundleScript)) {
  console.log('Running generate_bundle.cjs...');
  execSync(`node "${bundleScript}"`, { stdio: 'inherit' });
}

// Sync netlify-adapter.js to public if both exist
const rootAdapter = path.join(__dirname, '../netlify-adapter.js');
const publicAdapter = path.join(__dirname, '../public/netlify-adapter.js');
if (fs.existsSync(rootAdapter)) {
  fs.copyFileSync(rootAdapter, publicAdapter);
  console.log('Copied netlify-adapter.js to public/netlify-adapter.js');
}

console.log('Import and bundle update completed successfully!');
