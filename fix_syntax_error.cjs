const fs = require('fs');
const vm = require('vm');
const path = require('path');

const indexPath = path.join(__dirname, '../index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// Fix the missing closing backtick in line 3157
const targetStr = ': `No stray dogs tagged under health condition <strong>"${escapeHtml(appState.strayFilterCondition)}"';
const replacementStr = ': `No stray dogs tagged under health condition <strong>"${escapeHtml(appState.strayFilterCondition)}"</strong>.`';

if (html.includes(targetStr)) {
  html = html.replace(targetStr, replacementStr);
  fs.writeFileSync(indexPath, html, 'utf8');
  console.log('Replaced broken line in index.html successfully!');
} else {
  console.log('Target string not found in index.html, searching line by line...');
  const lines = html.split('\n');
  lines.forEach((line, idx) => {
    if (line.includes('No stray dogs tagged under health condition')) {
      console.log(`Line ${idx + 1}: ${line}`);
    }
  });
}

// Validate script tags
const scriptMatches = html.match(/<script[\s\S]*?>([\s\S]*?)<\/script>/gi);
let allPassed = true;
if (scriptMatches) {
  scriptMatches.forEach((s, idx) => {
    const inner = s.replace(/^<script[\s\S]*?>/i, '').replace(/<\/script>$/i, '');
    try {
      new vm.Script(inner, { filename: `script_${idx}.js` });
      console.log(`Script block ${idx} parsed CLEANLY!`);
    } catch (e) {
      allPassed = false;
      console.error(`Script block ${idx} has error:`, e.message);
      console.error(e.stack);
    }
  });
}

if (allPassed) {
  console.log('ALL SCRIPT BLOCKS PARSED WITH ZERO SYNTAX ERRORS!');
}
