const fs = require('fs');

console.log('--- Finalizing Pet-Tech Design System updates ---');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Toast notice background to Dark Slate Grey
html = html.replace(
  /\.toast-notice\s*\{([^}]*?)background:\s*#0f172a;/g,
  '.toast-notice {$1background: #1E293B;'
);

// 2. Stray area pick button
html = html.replace(
  /border:\s*1\.5px\s+solid\s+#0284c7;\s*color:\s*#0369a1;\s*background:\s*#f0f9ff;/g,
  'border: 1.5px solid #E05A47; color: #E05A47; background: #FFF1EE;'
);

// 3. Category switcher btn border
html = html.replace(
  /\.category-switcher-btn\s*\{([^}]*?)border:\s*1\.5px\s+solid\s+#0284c7;/g,
  '.category-switcher-btn {$1border: 1.5px solid #E05A47;'
);

// 4. Cat btn caption & categories bar label
html = html.replace(
  /\.cat-btn-caption\s*\{([^}]*?)color:\s*#0284c7;/g,
  '.cat-btn-caption {$1color: #E05A47;'
);
html = html.replace(
  /\.categories-bar-label\s*\{([^}]*?)color:\s*#0284c7;/g,
  '.categories-bar-label {$1color: #E05A47;'
);

// 5. Cat bar grid btn
html = html.replace(
  /\.cat-bar-grid-btn\s*\{([^}]*?)color:\s*#0369a1;\s*background:\s*#e0f2fe;\s*border:\s*1px\s+solid\s+#bae6fd;/g,
  '.cat-bar-grid-btn {$1color: #E05A47; background: #FFE8E2; border: 1px solid #F8CCC0;'
);

// 6. Header account btn border
html = html.replace(
  /\.header-account-btn\s*\{([^}]*?)border:\s*1\.5px\s+solid\s+#0284c7;/g,
  '.header-account-btn {$1border: 1.5px solid #E05A47;'
);

// 7. Service entry badge (Module 6 Pet Spa / Grooming)
html = html.replace(
  /\.service-entry-badge\s*\{([^}]*?)color:\s*#0284c7;\s*background:\s*#f0f9ff;/g,
  '.service-entry-badge {$1color: #2D6A4F; background: #E8F5EE;'
);

// 8. Body inline styles:
html = html.replace(
  '<span style="font-weight: 700; color: #0284c7;">Active Google Account:</span>',
  '<span style="font-weight: 700; color: #E05A47;">Active Google Account:</span>'
);
html = html.replace(
  '<strong class="stat-num" id="statActiveAccountName" style="color: #0369a1;">Alex Rivera</strong>',
  '<strong class="stat-num" id="statActiveAccountName" style="color: #2D6A4F;">Alex Rivera</strong>'
);
html = html.replace(
  '<span class="badge" style="background: #e0f2fe; color: #0369a1; font-weight: 700;" id="profileVetsBadgeCount">Same Area</span>',
  '<span class="badge" style="background: #E8F5EE; color: #2D6A4F; font-weight: 700;" id="profileVetsBadgeCount">Same Area</span>'
);
html = html.replace(
  '<span class="badge" style="background: #e0f2fe; color: #0369a1; font-weight: 700;" id="securityTotalLogsBadge">0 Events</span>',
  '<span class="badge" style="background: #E8F5EE; color: #2D6A4F; font-weight: 700;" id="securityTotalLogsBadge">0 Events</span>'
);
html = html.replace(
  '<span style="font-size: 0.72rem; color: #0284c7; font-weight: 600;">',
  '<span style="font-size: 0.72rem; color: #2D6A4F; font-weight: 600;">'
);

// Avatar color button and selector border
html = html.replace(
  'style="width:26px; height:26px; border-radius:50%; background:#0284c7; border:2px solid #000; cursor:pointer;" onclick="selectAvatarColor(this, \'#0284c7\')" title="Sky Blue"',
  'style="width:26px; height:26px; border-radius:50%; background:#E05A47; border:2px solid #1E293B; cursor:pointer;" onclick="selectAvatarColor(this, \'#E05A47\')" title="Terracotta Coral"'
);
html = html.replace(
  "btn.style.border = '2px solid #000';",
  "btn.style.border = '2px solid #1E293B';"
);

// Remove remaining pure blacks: image viewer backdrop and SVG pet noses/mouths
html = html.replace(
  'border-radius: 6px; background: #000; display: flex;',
  'border-radius: 6px; background: #1E293B; display: flex;'
);
html = html.replace(/fill="#000000"/g, 'fill="#1E293B"');
html = html.replace(/stroke="#000000"/g, 'stroke="#1E293B"');

fs.writeFileSync('index.html', html, 'utf8');
console.log('✓ Successfully finalized all styles in index.html!');
