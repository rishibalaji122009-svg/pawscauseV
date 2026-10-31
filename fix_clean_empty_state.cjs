const fs = require('fs');
const vm = require('vm');
const path = require('path');

const indexPath = path.join(__dirname, '../index.html');
let html = fs.readFileSync(indexPath, 'utf8');

const oldStart = html.indexOf('if (list.length === 0) {');
const oldEnd = html.indexOf('// Render Area-Grouped Sections');

if (oldStart !== -1 && oldEnd !== -1) {
  const cleanEmptyBlock = `if (list.length === 0) {
        let emptyMsg = activeArea
          ? \`No stray dogs found in area <strong>"\${escapeHtml(activeArea)}"</strong>.\`
          : \`No stray dogs tagged under health condition <strong>"\${escapeHtml(appState.strayFilterCondition)}"</strong>.\`;

        container.innerHTML = \`
          <div class="state-container" style="padding: 2.25rem 1.5rem; text-align: center; width: 100%;">
            <div class="state-icon">🐕</div>
            <div style="font-weight: 700; font-size: 1.05rem; color: #0f172a; margin-bottom: 0.35rem;">
              No stray dogs found matching this filter
            </div>
            <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.15rem; max-width: 480px; margin-left: auto; margin-right: auto;">
              \${emptyMsg}
            </div>
            <div style="display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap;">
              \${activeArea ? \`<button type="button" class="btn btn-outline" style="font-size: 0.8rem; padding: 0.35rem 0.8rem;" onclick="clearStrayAreaSearch()">Clear Area Search</button>\` : ''}
              \${appState.strayFilterCondition !== 'all' ? \`<button type="button" class="btn btn-outline" style="font-size: 0.8rem; padding: 0.35rem 0.8rem;" onclick="resetStrayConditionFilter()">Show All Conditions</button>\` : ''}
              <button type="button" class="btn btn-primary" style="font-size: 0.8rem; padding: 0.35rem 0.8rem;" onclick="resetAllStrayFilters()">Reset All Filters</button>
            </div>
          </div>
        \`;
        return;
      }\n\n      `;

  html = html.slice(0, oldStart) + cleanEmptyBlock + html.slice(oldEnd);
  fs.writeFileSync(indexPath, html, 'utf8');
  console.log('Replaced empty block with clean, syntax-error-free version!');
} else {
  console.error('Could not find old empty block boundaries');
}

// Validate ALL script blocks
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
  console.log('🎉 ALL SCRIPT BLOCKS PARSED WITH ZERO SYNTAX ERRORS!');
}
