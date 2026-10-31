const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '../index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// 1. Add CSS for stray area cards and area group boxes
const cssToAdd = `
    .stray-area-card {
      background: #ffffff;
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 0.85rem 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
      cursor: pointer;
    }
    .stray-area-card:hover {
      transform: translateY(-2px);
      border-color: #0284c7;
      box-shadow: var(--shadow-sm);
    }
    .stray-area-card.selected {
      border-color: #0284c7;
      background: #f0f9ff;
      box-shadow: 0 0 0 2px rgba(2, 132, 199, 0.2);
    }
    .stray-area-group-box {
      margin-bottom: 1.25rem;
      background: #ffffff;
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      padding: 0.9rem 1rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.02);
    }
`;

if (!html.includes('.stray-area-card {')) {
  html = html.replace('.puppy-area-card {', cssToAdd + '\n    .puppy-area-card {');
}

// 2. Add HTML for #strayAreasSummaryContainer after #strayAreaTrackingBanner
const areaSummaryHtml = `
            <!-- Individual Area Census & Summary Grid (Matching Puppies Laid Area Cards) -->
            <div style="margin-top: 0.85rem; border-top: 1px dashed #cbd5e1; padding-top: 0.85rem; margin-bottom: 0.85rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.65rem;">
                <div style="display: flex; align-items: center; gap: 0.45rem;">
                  <span style="font-size: 0.92rem; font-weight: 800; color: #0f172a;">📍 Individual Area Census: Stray Care by Neighborhood</span>
                  <span id="totalStraysOverallBadge" style="font-size: 0.72rem; font-weight: 800; background: #0284c7; color: #ffffff; padding: 0.15rem 0.55rem; border-radius: 999px;">0 Total Dogs</span>
                </div>
                <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">
                  Click an area card to view dogs in that sector
                </div>
              </div>
              <div id="strayAreasSummaryContainer" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 0.65rem;">
                <!-- Dynamically populated area census cards -->
              </div>
            </div>
`;

if (!html.includes('id="strayAreasSummaryContainer"')) {
  html = html.replace(
    '<div id="strayAreaTrackingBanner" class="stray-area-census-banner">\n              <!-- Dynamically rendered tracking census info -->\n            </div>',
    '<div id="strayAreaTrackingBanner" class="stray-area-census-banner">\n              <!-- Dynamically rendered tracking census info -->\n            </div>' + areaSummaryHtml
  );
}

// 3. Update renderStrayAreaTrackingControls and renderStrays JavaScript logic
const newJSCode = `
    function groupStraysByArea(straysArray) {
      const groups = {};
      for (const s of straysArray) {
        const area = (s.localArea && s.localArea.trim()) ? s.localArea.trim() : 'Unspecified Zone';
        if (!groups[area]) groups[area] = [];
        groups[area].push(s);
      }
      return groups;
    }

    function renderAreaGroupedStrayList(straysArray, emptyTitle, emptySubtitle) {
      if (!straysArray || straysArray.length === 0) {
        return \`
          <div class="stray-empty-box">
            <div style="font-size: 1.6rem; margin-bottom: 0.35rem;">🐾</div>
            <div style="font-weight: 700; color: #1e293b; margin-bottom: 0.25rem;">\${emptyTitle}</div>
            <div style="font-size: 0.82rem; color: var(--text-muted);">\${emptySubtitle}</div>
          </div>
        \`;
      }

      const groups = groupStraysByArea(straysArray);
      const sortedAreas = Object.keys(groups).sort((a, b) => groups[b].length - groups[a].length || a.localeCompare(b));

      return sortedAreas.map(areaName => {
        const dogsInArea = groups[areaName];
        const userCount = dogsInArea.filter(s => isUserStrayCreator(s)).length;
        const commCount = dogsInArea.length - userCount;

        // Count health triage flags in this area
        const rabies = dogsInArea.filter(s => s.healthIndex && s.healthIndex.includes('Rabies Symptoms')).length;
        const wounded = dogsInArea.filter(s => s.healthIndex && s.healthIndex.includes('Wounded')).length;
        const aggressive = dogsInArea.filter(s => s.healthIndex && s.healthIndex.includes('Aggressive')).length;
        const healthBadges = [];
        if (rabies > 0) healthBadges.push(\`<span style="font-size:0.7rem; font-weight:700; background:#fee2e2; color:#b91c1c; padding:0.1rem 0.45rem; border-radius:4px; border:1px solid #fca5a5;">🚨 \${rabies} Rabies</span>\`);
        if (wounded > 0) healthBadges.push(\`<span style="font-size:0.7rem; font-weight:700; background:#ffedd5; color:#c2410c; padding:0.1rem 0.45rem; border-radius:4px; border:1px solid #fdba74;">🩹 \${wounded} Wounded</span>\`);
        if (aggressive > 0) healthBadges.push(\`<span style="font-size:0.7rem; font-weight:700; background:#fef3c7; color:#d97706; padding:0.1rem 0.45rem; border-radius:4px; border:1px solid #fde68a;">⚠️ \${aggressive} Aggressive</span>\`);

        return \`
          <div class="stray-area-group-box">
            <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 0.65rem; border-bottom: 1px solid #f1f5f9; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.4rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                <span style="font-size: 1.05rem; font-weight: 800; color: #0f172a; display: flex; align-items: center; gap: 0.35rem;">
                  <span>📍</span> <span>\${escapeHtml(areaName)}</span>
                </span>
                <span style="font-size: 0.75rem; font-weight: 800; background: #e0f2fe; color: #0369a1; padding: 0.15rem 0.55rem; border-radius: 999px; border: 1px solid #bae6fd;">
                  \${dogsInArea.length} Dog\${dogsInArea.length === 1 ? '' : 's'} Logged
                </span>
                <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: 600;">
                  (\${userCount} by you · \${commCount} community)
                </span>
                \${healthBadges.join(' ')}
              </div>
              <button type="button" class="btn btn-outline" style="font-size: 0.72rem; padding: 0.2rem 0.55rem; border-color: #bae6fd; color: #0369a1;" onclick="pickStrayArea('\${escapeHtml(areaName).replace(/'/g, "\\\\'")}')">
                Focus Area
              </button>
            </div>
            <div class="grid-cards">
              \${dogsInArea.map(renderStrayCardHtml).join('')}
            </div>
          </div>
        \`;
      }).join('');
    }

    function renderStrayAreaTrackingControls(census) {
      // 1. Update Area Count Badge on "Pick Area" button
      const areasCountBadge = document.getElementById('strayAreasCountBadge');
      if (areasCountBadge) {
        areasCountBadge.textContent = \`\${census.length} Area\${census.length === 1 ? '' : 's'}\`;
      }
      
      // 2. Render Quick Area Chips
      const chipsContainer = document.getElementById('strayQuickAreaChips');
      if (chipsContainer) {
        const activeArea = (appState.straySearchArea || '').toLowerCase().trim();
        const isAllActive = !activeArea;
        const allChipHtml = \`
          <button
            type="button"
            class="stray-area-chip \${isAllActive ? 'active' : ''}"
            onclick="pickStrayArea('all')"
            title="Show stray dogs from all areas"
          >
            <span>🌐 All Areas</span>
            <span class="stray-area-chip-badge">\${appState.strays.length}</span>
          </button>
        \`;
        const areaChipsHtml = census.map(item => {
          const isSelected = activeArea && (item.area.toLowerCase() === activeArea || item.area.toLowerCase().includes(activeArea));
          return \`
            <button
              type="button"
              class="stray-area-chip \${isSelected ? 'active' : ''}"
              onclick="pickStrayArea('\${escapeHtml(item.area).replace(/'/g, "\\\\'")}')"
              title="Filter to \${escapeHtml(item.area)}: \${item.count} stray dog\${item.count === 1 ? '' : 's'}"
            >
              <span>📍 \${escapeHtml(item.area)}</span>
              <span class="stray-area-chip-badge">\${item.count}</span>
            </button>
          \`;
        }).join('');
        chipsContainer.innerHTML = allChipHtml + areaChipsHtml;
      }

      // 3. Render Area Tracking & Census Banner
      const trackingBanner = document.getElementById('strayAreaTrackingBanner');
      if (trackingBanner) {
        const activeArea = (appState.straySearchArea || '').trim();
        if (activeArea) {
          const matchingDogsInArea = appState.strays.filter(s => s.localArea && s.localArea.toLowerCase().includes(activeArea.toLowerCase()));
          const count = matchingDogsInArea.length;
          const rabies = matchingDogsInArea.filter(s => s.healthIndex && s.healthIndex.includes('Rabies Symptoms')).length;
          const aggressive = matchingDogsInArea.filter(s => s.healthIndex && s.healthIndex.includes('Aggressive')).length;
          const broken = matchingDogsInArea.filter(s => s.healthIndex && s.healthIndex.includes('Broken Limb')).length;
          const wounded = matchingDogsInArea.filter(s => s.healthIndex && s.healthIndex.includes('Wounded')).length;
          const skin = matchingDogsInArea.filter(s => s.healthIndex && s.healthIndex.includes('Skin Infection')).length;

          const details = [];
          if (rabies > 0) details.push(\`🚨 \${rabies} Rabies Alert\`);
          if (aggressive > 0) details.push(\`⚠️ \${aggressive} Aggressive\`);
          if (broken > 0) details.push(\`🦴 \${broken} Broken Limb\`);
          if (wounded > 0) details.push(\`🩹 \${wounded} Wounded\`);
          if (skin > 0) details.push(\`🩺 \${skin} Skin Infection\`);

          trackingBanner.style.display = 'block';
          trackingBanner.innerHTML = \`
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span style="font-weight: 800; font-size: 0.95rem; color: #0369a1;">📍 Active Area Focus: "\${escapeHtml(activeArea)}"</span>
                <span style="font-size: 0.75rem; font-weight: 700; background: #e0f2fe; color: #0369a1; padding: 0.15rem 0.5rem; border-radius: 999px;">
                  \${count} Dog\${count === 1 ? '' : 's'} in Area
                </span>
              </div>
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                \${details.length > 0 ? \`<span style="font-size: 0.75rem; color: #b91c1c; font-weight: 700;">\${details.join(' · ')}</span>\` : '<span style="font-size: 0.75rem; color: #059669; font-weight: 700;">💚 All Stable Triage</span>'}
                <button type="button" class="btn btn-outline" style="font-size: 0.72rem; padding: 0.2rem 0.5rem; border-color: #bae6fd; color: #0369a1;" onclick="clearStrayAreaSearch()">Show All Areas</button>
              </div>
            </div>
          \`;
        } else {
          trackingBanner.style.display = 'none';
        }
      }

      // 4. Render Individual Area Summary Cards Grid (Matching Puppies Laid Area Display)
      const totalStraysBadge = document.getElementById('totalStraysOverallBadge');
      if (totalStraysBadge) {
        totalStraysBadge.textContent = \`\${appState.strays.length} Total Stray Dog\${appState.strays.length === 1 ? '' : 's'}\`;
      }
      const summaryContainer = document.getElementById('strayAreasSummaryContainer');
      if (summaryContainer) {
        if (census.length === 0) {
          summaryContainer.innerHTML = \`
            <div style="grid-column: 1 / -1; padding: 0.85rem; text-align: center; color: #0369a1; background: #f0f9ff; border: 1px dashed #bae6fd; border-radius: var(--radius-md); font-size: 0.85rem;">
              No stray dogs registered in any area yet. Tag a stray dog using the form on the left to add them to an area census.
            </div>
          \`;
        } else {
          const activeArea = (appState.straySearchArea || '').toLowerCase().trim();
          summaryContainer.innerHTML = census.map(item => {
            const isSelected = activeArea && (item.area.toLowerCase() === activeArea || item.area.toLowerCase().includes(activeArea));
            const healthFlags = [];
            if (item.rabiesCount > 0) healthFlags.push(\`<span style="color:#b91c1c; font-weight:700;">🔴 \${item.rabiesCount} Rabies</span>\`);
            if (item.woundedCount > 0) healthFlags.push(\`<span style="color:#c2410c; font-weight:700;">🩹 \${item.woundedCount} Wounded</span>\`);
            if (item.aggressiveCount > 0) healthFlags.push(\`<span style="color:#d97706; font-weight:700;">⚠️ \${item.aggressiveCount} Aggr</span>\`);

            return \`
              <div 
                class="stray-area-card \${isSelected ? 'selected' : ''}" 
                onclick="pickStrayArea('\${escapeHtml(item.area).replace(/'/g, "\\\\'")}')"
                title="Area Census: Click to view all \${item.count} stray dogs in \${escapeHtml(item.area)}"
              >
                <div>
                  <div style="font-size: 0.72rem; color: #0284c7; font-weight: 700; text-transform: uppercase; letter-spacing: 0.03em;">📍 Area / Sector</div>
                  <div style="font-size: 1.05rem; font-weight: 800; color: #0f172a; margin-top: 0.1rem;">\${escapeHtml(item.area)}</div>
                  <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 0.15rem;">
                    \${healthFlags.length > 0 ? healthFlags.join(' · ') : '💚 Stable Triage'}
                  </div>
                </div>
                <div style="text-align: right; background: \${isSelected ? '#e0f2fe' : '#f0f9ff'}; border: 1px solid \${isSelected ? '#0284c7' : '#bae6fd'}; padding: 0.35rem 0.65rem; border-radius: var(--radius-md);">
                  <div style="font-size: 1.35rem; font-weight: 900; color: #0369a1; line-height: 1;" class="tabular-nums">\${item.count}</div>
                  <div style="font-size: 0.68rem; font-weight: 700; color: #0284c7; text-transform: uppercase;">Dog\${item.count === 1 ? '' : 's'}</div>
                </div>
              </div>
            \`;
          }).join('');
        }
      }
    }
`;

// Replace renderStrayAreaTrackingControls function in HTML
const oldControlStart = html.indexOf('function renderStrayAreaTrackingControls(');
const oldControlEnd = html.indexOf('function renderStrays()');

if (oldControlStart !== -1 && oldControlEnd !== -1) {
  html = html.slice(0, oldControlStart) + newJSCode + '\n    ' + html.slice(oldControlEnd);
}

// Now replace renderStrays implementation to render area grouped stray lists
const renderStraysCode = `
    function renderStrays() {
      const container = document.getElementById('straysContainer');
      const countEl = document.getElementById('straysDisplayCount');

      // 1. Calculate Census and update Area Controls
      const census = getStrayAreaCensus();
      renderStrayAreaTrackingControls(census);

      // 2. Filter strays by Health Condition and Area
      let list = [...appState.strays];
      if (appState.strayFilterCondition !== 'all') {
        list = list.filter(s => Array.isArray(s.healthIndex) && s.healthIndex.includes(appState.strayFilterCondition));
      }
      if (appState.straySearchArea && appState.straySearchArea.trim()) {
        const q = appState.straySearchArea.trim().toLowerCase();
        list = list.filter(s => s.localArea && s.localArea.toLowerCase().includes(q));
      }

      // Segregate into user-created entries and community entries
      const userStrays = list.filter(s => isUserStrayCreator(s));
      const communityStrays = list.filter(s => !isUserStrayCreator(s));

      // 3. Update count label & segregation tab counts
      const activeArea = (appState.straySearchArea || '').trim();
      if (countEl) {
        if (activeArea) {
          countEl.innerHTML = \`\${list.length} in "\${escapeHtml(activeArea)}" <span style="font-weight: 400; color: #64748b; font-size: 0.8rem;">(\${userStrays.length} by you · \${communityStrays.length} community)</span>\`;
        } else {
          countEl.innerHTML = \`\${list.length} Logged Case\${list.length === 1 ? '' : 's'} <span style="font-weight: 400; color: #64748b; font-size: 0.8rem;">(\${userStrays.length} by you · \${communityStrays.length} community)</span>\`;
        }
      }

      // Sync segregation tabs counters and active states
      const countTabAll = document.getElementById('countStrayTabAll');
      const countTabUser = document.getElementById('countStrayTabUser');
      const countTabCommunity = document.getElementById('countStrayTabCommunity');

      if (countTabAll) countTabAll.textContent = list.length;
      if (countTabUser) countTabUser.textContent = userStrays.length;
      if (countTabCommunity) countTabCommunity.textContent = communityStrays.length;

      const currentFilter = appState.strayOwnershipFilter || 'all';
      const tabAll = document.getElementById('tabStrayAll');
      const tabUser = document.getElementById('tabStrayUser');
      const tabCommunity = document.getElementById('tabStrayCommunity');

      if (tabAll) tabAll.classList.toggle('active', currentFilter === 'all');
      if (tabUser) tabUser.classList.toggle('active', currentFilter === 'user');
      if (tabCommunity) tabCommunity.classList.toggle('active', currentFilter === 'community');

      if (list.length === 0) {
        container.innerHTML = \`
          <div class="state-container" style="padding: 2.25rem 1.5rem; text-align: center; width: 100%;">
            <div class="state-icon">🐕</div>
            <div style="font-weight: 700; font-size: 1.05rem; color: #0f172a; margin-bottom: 0.35rem;">
              No stray dogs found matching this filter
            </div>
            <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.15rem; max-width: 480px; margin-left: auto; margin-right: auto;">
              \${activeArea
                ? \`No stray dogs found in area <strong>"\${escapeHtml(activeArea)}"</strong> \${appState.strayFilterCondition !== 'all' ? \`with condition <strong>"\${escapeHtml(appState.strayFilterCondition)}"\` : ''}.\`
                : \`No stray dogs tagged under health condition <strong>"\${escapeHtml(appState.strayFilterCondition)}"\`.
              }
            </div>
            <div style="display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap;">
              \${activeArea ? \`<button type="button" class="btn btn-outline" style="font-size: 0.8rem; padding: 0.35rem 0.8rem;" onclick="clearStrayAreaSearch()">Clear Area Search</button>\` : ''}
              \${appState.strayFilterCondition !== 'all' ? \`<button type="button" class="btn btn-outline" style="font-size: 0.8rem; padding: 0.35rem 0.8rem;" onclick="resetStrayConditionFilter()">Show All Conditions</button>\` : ''}
              <button type="button" class="btn btn-primary" style="font-size: 0.8rem; padding: 0.35rem 0.8rem;" onclick="resetAllStrayFilters()">Reset All Filters</button>
            </div>
          </div>
        \`;
        return;
      }

      // Render Area-Grouped Sections
      const renderUserSection = () => \`
        <div class="stray-section-wrap" id="strayUserSection">
          <div class="stray-section-header user-section-header">
            <div class="stray-section-title-wrap">
              <h3 class="stray-section-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>Your Reported Stray Dogs</span>
              </h3>
              <p class="stray-section-subtitle">
                Stray dogs you entered into the network, organized by individual area. You have exclusive ownership and edit access for these records.
              </p>
            </div>
            <div class="stray-section-badge">
              \${userStrays.length} Case\${userStrays.length === 1 ? '' : 's'} Logged by You
            </div>
          </div>
          \${renderAreaGroupedStrayList(userStrays, 'No Stray Dogs Logged by You Yet', 'Whenever you log a stray dog sighting using the form on the left, it will appear right here under your personal area entries.')}
        </div>
      \`;

      const renderCommunitySection = () => \`
        <div class="stray-section-wrap" id="strayCommunitySection">
          <div class="stray-section-header community-section-header">
            <div class="stray-section-title-wrap">
              <h3 class="stray-section-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <span>Community Reported Stray Dogs Feed</span>
              </h3>
              <p class="stray-section-subtitle">
                Stray dogs reported by other community members, categorized and represented by individual area.
              </p>
            </div>
            <div class="stray-section-badge community-badge">
              \${communityStrays.length} Community Case\${communityStrays.length === 1 ? '' : 's'}
            </div>
          </div>
          \${renderAreaGroupedStrayList(communityStrays, 'No Community Cases Found', 'No stray dogs reported by other users match the current filter.')}
        </div>
      \`;

      let outputHtml = '';
      if (currentFilter === 'all') {
        outputHtml = renderUserSection() + renderCommunitySection();
      } else if (currentFilter === 'user') {
        outputHtml = renderUserSection();
      } else if (currentFilter === 'community') {
        outputHtml = renderCommunitySection();
      }

      container.innerHTML = outputHtml;
    }
`;

const oldRenderStraysStart = html.indexOf('function renderStrays() {');
const oldRenderStraysEnd = html.indexOf('function filterStrays(');

if (oldRenderStraysStart !== -1 && oldRenderStraysEnd !== -1) {
  html = html.slice(0, oldRenderStraysStart) + renderStraysCode + '\n    ' + html.slice(oldRenderStraysEnd);
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Successfully updated index.html for individual area stray care display!');
