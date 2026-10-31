const fs = require('fs');

console.log('--- Applying Premium Pet-Tech Design System to index.html ---');
let html = fs.readFileSync('index.html', 'utf8');

// Ensure zero modifications to the JS logic or HTML structure; only CSS <style> and inline styles!

// ==========================================
// 1. UPDATE :root CSS VARIABLES
// ==========================================
const oldRootRegex = /:root\s*\{[\s\S]*?--shadow-lg:[^;]+;\s*\}/;
const newRoot = `:root {
      --font-body: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      --font-display: 'Outfit', system-ui, -apple-system, sans-serif;
      
      /* Backgrounds (Clean & Modern: Off-White / Cream Warmth) */
      --bg-base: #FAF7F2;
      --bg-surface: #ffffff;
      --bg-surface-alt: #F7F3EE;
      --border-subtle: #EBE5DF;
      --border-focus: #E05A47;
      
      /* Text / Headlines (Dark Slate Grey: Zero pure black) */
      --text-main: #1E293B;
      --text-muted: #64748B;
      --text-light: #94A3B8;
      
      /* Primary (Warmth & Compassion: Terracotta / Warm Coral) */
      --brand-primary: #E05A47;
      --brand-primary-hover: #C84B3A;
      --brand-accent: #EE6C4D;
      
      /* Secondary (Trust & Freshness: Forest Mint / Sage Green) */
      --brand-emerald: #2D6A4F;
      --brand-emerald-hover: #22543D;
      --brand-emerald-bright: #52B788;
      --brand-sage: #74C69D;
      --brand-mint-subtle: #E8F5EE;
      --brand-coral-subtle: #FFF1EE;
      
      --brand-rose: #E05A47;
      --brand-indigo: #475569;
      
      --radius-sm: 6px;
      --radius-md: 10px;
      --radius-lg: 14px;
      --radius-xl: 20px;
      
      /* Cards & Containers: Pure White with subtle soft shadows */
      --shadow-sm: 0 1px 3px 0 rgba(30, 41, 59, 0.04);
      --shadow-md: 0 4px 12px rgba(30, 41, 59, 0.05);
      --shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.05);
      --card-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
    }`;

if (oldRootRegex.test(html)) {
  html = html.replace(oldRootRegex, newRoot);
  console.log('✓ :root CSS variables updated to Terracotta & Mint Design System');
} else {
  console.warn('! Could not match :root regex directly');
}

// ==========================================
// 2. HERO BANNER BASE STYLES & LEADERBOARD BADGES
// ==========================================
const newHeroBannerStyle = `    /* Friendly 2D Pet Hero Banners - Warm Coral & Sage Mint Pastel Gradient */
    .pet-hero-banner {
      background: linear-gradient(135deg, #FFF1EE 0%, #FAF7F2 50%, #E8F5EE 100%);
      border: 1.5px solid #F8D5CE;
      border-radius: var(--radius-xl);
      padding: 1.25rem 1.5rem;
      margin-bottom: 1.75rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.25rem;
      box-shadow: 0 10px 25px rgba(224, 90, 71, 0.05);
      position: relative;
      overflow: hidden;
    }
    .pet-hero-content {
      flex: 1;
      position: relative;
      z-index: 2;
    }
    .pet-hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      background: #FFE8E2;
      color: #C84B3A;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.2rem 0.65rem;
      border-radius: 9999px;
      margin-bottom: 0.4rem;
      border: 1px solid #F8CCC0;
    }
    .pet-hero-title {
      font-family: var(--font-display);
      font-size: 1.35rem;
      font-weight: 800;
      color: var(--text-main);
      letter-spacing: -0.02em;
    }
    .pet-hero-text {
      font-size: 0.875rem;
      color: var(--text-muted);
      margin-top: 0.25rem;
      max-width: 680px;
      line-height: 1.45;
    }`;

const heroBannerRegex = /\/\*\s*(?:Friendly 2D Pet Hero Banners|Pet Hero Banners)[\s\S]*?\.pet-hero-text\s*\{[\s\S]*?\}/;
if (heroBannerRegex.test(html)) {
  html = html.replace(heroBannerRegex, newHeroBannerStyle);
  console.log('✓ Hero banner base styles updated in <style>');
}

const newBadgesStyle = `    /* Badge Emblems - Earthy Terracotta & Mint Aesthetic */
    .badge-master {
      background: linear-gradient(135deg, #E05A47, #C84B3A);
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(224, 90, 71, 0.25);
    }
    .badge-diamond {
      background: linear-gradient(135deg, #2D6A4F, #52B788);
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(45, 106, 79, 0.25);
    }
    .badge-elite {
      background: linear-gradient(135deg, #EE6C4D, #E05A47);
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(238, 108, 77, 0.22);
    }
    .badge-beginner {
      background: linear-gradient(135deg, #52B788, #74C69D);
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(82, 183, 136, 0.2);
    }
    .badge-novice {
      background: #94A3B8;
      color: #ffffff;
    }`;

const badgesRegex = /\/\*\s*Badge Emblems[\s\S]*?\.badge-novice\s*\{[\s\S]*?\}/;
if (badgesRegex.test(html)) {
  html = html.replace(badgesRegex, newBadgesStyle);
  console.log('✓ Leaderboard badges updated in <style>');
}

// ==========================================
// 3. UPDATE ALL RULES IN <style> WITH LEGACY BLUES / PURE BLACKS / AMBERS
// ==========================================
// Extract style content to process safely
const styleMatch = html.match(/(<style[^>]*>)([\s\S]*?)(<\/style>)/);
if (styleMatch) {
  let styleBlock = styleMatch[2];

  // Brand Logo
  styleBlock = styleBlock.replace(
    /(\.brand-logo\s*\{[^}]*background:\s*)linear-gradient\(135deg,\s*#0284c7,\s*#0ea5e9\)/g,
    '$1linear-gradient(135deg, #E05A47, #EE6C4D)'
  );

  // Cards soft shadows & pure white containers
  styleBlock = styleBlock.replace(
    /box-shadow:\s*0\s+4px\s+6px\s+-1px\s+rgba\(0,\s*0,\s*0,\s*0\.08\)[^;]*;/g,
    'box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);'
  );
  styleBlock = styleBlock.replace(
    /box-shadow:\s*0\s+4px\s+6px\s+-1px\s+rgba\(0,\s*0,\s*0,\s*0\.1\)[^;]*;/g,
    'box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);'
  );
  styleBlock = styleBlock.replace(
    /box-shadow:\s*0\s+10px\s+15px\s+-3px\s+rgba\(0,\s*0,\s*0,\s*0\.08\)[^;]*;/g,
    'box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);'
  );

  // Remove pure black text #000000 and dark blue #0f172a in favor of Dark Slate Grey #1E293B
  styleBlock = styleBlock.replace(/color:\s*#0f172a\b/g, 'color: #1E293B');
  styleBlock = styleBlock.replace(/color:\s*#000000\b/g, 'color: #1E293B');
  styleBlock = styleBlock.replace(/color:\s*black\b/g, 'color: #1E293B');

  // Vet Cards (Module 5): Forest Mint & Sage Green
  styleBlock = styleBlock.replace(/border-top:\s*4px\s+solid\s+#0284c7;/g, 'border-top: 4px solid #2D6A4F;');
  styleBlock = styleBlock.replace(/border:\s*2px\s+solid\s+#0284c7;\s*border-top:\s*5px\s+solid\s+#0284c7;/g, 'border: 2px solid #52B788; border-top: 5px solid #2D6A4F;');
  styleBlock = styleBlock.replace(/background:\s*#e0f2fe;\s*color:\s*#0369a1;/g, 'background: #E8F5EE; color: #2D6A4F;');
  styleBlock = styleBlock.replace(/\.vet-phone-link\s*\{([^}]*?)background:\s*#0284c7;/g, '.vet-phone-link {$1background: #2D6A4F;');
  styleBlock = styleBlock.replace(/\.vet-phone-link:hover\s*\{([^}]*?)background:\s*#0369a1;/g, '.vet-phone-link:hover {$1background: #22543D;');

  // Stray & Community Notes
  styleBlock = styleBlock.replace(/border-left-color:\s*#0284c7;/g, 'border-left-color: #2D6A4F;');
  styleBlock = styleBlock.replace(/\.pet-note-box\.neighbor-note\s*\{[^}]*background:\s*#f0f9ff;/g, '.pet-note-box.neighbor-note { background: #E8F5EE;');
  styleBlock = styleBlock.replace(/\.pet-note-box\.neighbor-note\s+\.note-label\s*\{[^}]*color:\s*#0369a1;/g, '.pet-note-box.neighbor-note .note-label { color: #2D6A4F;');

  // Lost & Found module (Found status -> Mint / Sage Green)
  styleBlock = styleBlock.replace(/\.status-found\s*\{[^}]*background:\s*#e0f2fe;\s*color:\s*#0369a1;/g, '.status-found { background: #E8F5EE; color: #2D6A4F;');
  styleBlock = styleBlock.replace(/\.report-category-btn\.active\.cat-found\s*\{[^}]*\}/g, `.report-category-btn.active.cat-found {
      background: #E8F5EE;
      color: #2D6A4F;
      border-color: #52B788;
      box-shadow: 0 2px 6px rgba(45, 106, 79, 0.18);
    }`);

  // Stray Area Search & Filter Chips (Terracotta & Coral)
  styleBlock = styleBlock.replace(/\.stray-area-search-input:focus\s*\{[^}]*\}/g, `.stray-area-search-input:focus {
      border-color: #E05A47;
      box-shadow: 0 0 0 3px rgba(224, 90, 71, 0.15);
    }`);
  styleBlock = styleBlock.replace(/\.stray-pick-area-btn:hover\s*\{[^}]*\}/g, `.stray-pick-area-btn:hover {
      background: #FFF1EE;
      border-color: #E05A47;
      transform: translateY(-1px);
      box-shadow: var(--shadow-sm);
    }`);
  styleBlock = styleBlock.replace(/\.stray-areas-count-pill\s*\{([^}]*?)background:\s*#0284c7;/g, '.stray-areas-count-pill {$1background: #E05A47;');
  styleBlock = styleBlock.replace(/\.stray-area-chip:hover\s*\{[^}]*\}/g, `.stray-area-chip:hover {
      border-color: #E05A47;
      color: #C84B3A;
      background: #FFF1EE;
    }`);
  styleBlock = styleBlock.replace(/\.stray-area-chip\.active\s*\{[^}]*\}/g, `.stray-area-chip.active {
      background: #E05A47;
      color: #ffffff;
      border-color: #E05A47;
      font-weight: 700;
      box-shadow: 0 2px 6px rgba(224, 90, 71, 0.28);
    }`);
  styleBlock = styleBlock.replace(/\.stray-area-modal-card:hover\s*\{[^}]*\}/g, `.stray-area-modal-card:hover {
      border-color: #E05A47;
      background: #FFF1EE;
      transform: translateY(-2px);
      box-shadow: var(--shadow-sm);
    }`);
  styleBlock = styleBlock.replace(/\.stray-area-modal-card\.active\s*\{[^}]*\}/g, `.stray-area-modal-card.active {
      border-color: #E05A47;
      background: #FFF1EE;
      box-shadow: 0 0 0 2px rgba(224, 90, 71, 0.25);
    }`);

  // Category Switcher
  styleBlock = styleBlock.replace(/\.category-switcher-btn:hover\s*\{[^}]*\}/g, `.category-switcher-btn:hover {
      background: #FFF1EE;
      border-color: #E05A47;
      transform: translateY(-1px);
      box-shadow: var(--shadow-sm);
    }`);
  styleBlock = styleBlock.replace(/background:\s*linear-gradient\(135deg,\s*#0284c7,\s*#0369a1\);/g, 'background: linear-gradient(135deg, #E05A47, #EE6C4D);');
  styleBlock = styleBlock.replace(/\.category-item-card:hover\s*\{[^}]*\}/g, `.category-item-card:hover {
      border-color: #E05A47;
      background: #FAF7F2;
      transform: translateY(-2px);
      box-shadow: var(--shadow-sm);
    }`);
  styleBlock = styleBlock.replace(/\.category-item-card\.active\s*\{[^}]*\}/g, `.category-item-card.active {
      border-color: #E05A47;
      background: #FFF1EE;
      box-shadow: 0 0 0 2px rgba(224, 90, 71, 0.25);
    }`);
  styleBlock = styleBlock.replace(/\.cat-card-status\s*\{([^}]*?)background:\s*#0284c7;/g, '.cat-card-status {$1background: #E05A47;');

  // Active Navigation Tabs: Terracotta & Coral
  styleBlock = styleBlock.replace(/\.cat-nav-tab\.active\s*\{[^}]*\}/g, `.cat-nav-tab.active {
      background: #E05A47;
      color: #ffffff;
      font-weight: 700;
      box-shadow: 0 2px 8px rgba(224, 90, 71, 0.28);
      border-color: #E05A47;
    }`);
  styleBlock = styleBlock.replace(/\.cat-bar-grid-btn:hover\s*\{[^}]*\}/g, `.cat-bar-grid-btn:hover {
      background: #FFE8E2;
      color: #E05A47;
    }`);

  // Header Account Button & Pill
  styleBlock = styleBlock.replace(/\.header-account-btn:hover\s*\{[^}]*\}/g, `.header-account-btn:hover {
      background: #FFF1EE;
      border-color: #E05A47;
      transform: translateY(-1px);
      box-shadow: var(--shadow-sm);
    }`);
  styleBlock = styleBlock.replace(/\.account-btn-area\s*\{[^}]*color:\s*#0284c7;/g, '.account-btn-area { color: #E05A47;');
  styleBlock = styleBlock.replace(/\.netflix-area-pill\.active\s*\{[^}]*\}/g, `.netflix-area-pill.active {
      background: #C84B3A;
      color: #FFF1EE;
      border: 1px solid #E05A47;
    }`);

  // Module 6: Store (Warm Coral #EE6C4D / #E05A47) and Spa (Forest Mint #2D6A4F / #52B788)
  styleBlock = styleBlock.replace(/\.small-toggle-btn\.active\.spa-toggle\s*\{[^}]*\}/g, `.small-toggle-btn.active.spa-toggle {
      background: #2D6A4F;
      color: #ffffff;
      box-shadow: 0 2px 6px rgba(45, 106, 79, 0.35);
    }`);
  styleBlock = styleBlock.replace(/\.small-toggle-btn\.active\.store-toggle\s*\{[^}]*\}/g, `.small-toggle-btn.active.store-toggle {
      background: #E05A47;
      color: #ffffff;
      box-shadow: 0 2px 6px rgba(224, 90, 71, 0.35);
    }`);
  styleBlock = styleBlock.replace(/\.switch-pill-control input:checked \+ \.switch-slider\s*\{[^}]*background-color:\s*#0284c7;?\s*\}/g, `.switch-pill-control input:checked + .switch-slider {
      background-color: #2D6A4F;
    }`);
  styleBlock = styleBlock.replace(/\.essentials-subcat-btn\.active\.store-tab\s*\{[^}]*\}/g, `.essentials-subcat-btn.active.store-tab {
      border-bottom: 3px solid #E05A47;
      color: #C84B3A;
    }`);
  styleBlock = styleBlock.replace(/\.essentials-subcat-btn\.active\.spa-tab\s*\{[^}]*\}/g, `.essentials-subcat-btn.active.spa-tab {
      border-bottom: 3px solid #2D6A4F;
      color: #2D6A4F;
    }`);
  styleBlock = styleBlock.replace(/\.spa-cost-badge\s*\{[^}]*\}/g, `.spa-cost-badge {
      font-weight: 800;
      color: #2D6A4F;
      background: #E8F5EE;
      border: 1px solid #C3E6D5;
      padding: 0.15rem 0.55rem;
      border-radius: 999px;
      font-size: 0.75rem;
    }`);
  styleBlock = styleBlock.replace(/\.spa-package-card:hover\s*\{[^}]*\}/g, `.spa-package-card:hover {
      border-color: #52B788;
      box-shadow: 0 4px 12px rgba(45, 106, 79, 0.12);
      transform: translateY(-1.5px);
    }`);

  // License upload box
  styleBlock = styleBlock.replace(/\.license-upload-container\s*\{[^}]*\}/g, `.license-upload-container {
      padding: 0.85rem 1rem;
      border: 2px dashed #E05A47;
      background: #FFF8F6;
      border-radius: var(--radius-md);
      text-align: center;
      cursor: pointer;
    }`);
  styleBlock = styleBlock.replace(/\.pet-license-neighbor-caution\s*\{[^}]*\}/g, `.pet-license-neighbor-caution {
      background: #FFF8F6;
      border: 1px dashed #E05A47;
      border-radius: 4px;
      padding: 0.5rem;
    }`);

  // Put updated style block back
  html = html.replace(styleMatch[0], `${styleMatch[1]}${styleBlock}${styleMatch[3]}`);
  console.log('✓ <style> block rules completely refreshed');
}

// ==========================================
// 4. UPDATE THE 6 MODULE HERO BANNERS IN HTML
// ==========================================
// Module 1: Pet Registration
html = html.replace(
  /<div class="pet-hero-banner"(?: style="[^"]*")?>/i,
  '<div class="pet-hero-banner" style="background: linear-gradient(135deg, #FFF1EE 0%, #FAF7F2 50%, #E8F5EE 100%); border-color: #F8D5CE;">'
);

// Module 2: Street Guardian Network
html = html.replace(
  /<div class="pet-hero-banner" style="background: linear-gradient\(135deg, #[a-f0-9]{6}[^"]*">/i,
  '<div class="pet-hero-banner" style="background: linear-gradient(135deg, #E8F5EE 0%, #FAF7F2 50%, #FFF1EE 100%); border-color: #C3E6D5;">'
);

// For modules 3, 4, 5, 6: Replace old banners by searching for their module wrapper context
const heroBannerPastels = [
  // Module 1: Warm Coral to Mint
  'linear-gradient(135deg, #FFF1EE 0%, #FAF7F2 50%, #E8F5EE 100%); border-color: #F8D5CE;',
  // Module 2: Mint to Coral
  'linear-gradient(135deg, #E8F5EE 0%, #FAF7F2 50%, #FFF1EE 100%); border-color: #C3E6D5;',
  // Module 3: Community Rescue: Coral / Mint
  'linear-gradient(135deg, #FFF0EC 0%, #FAF7F2 50%, #EBF6F0 100%); border-color: #F8CCC0;',
  // Module 4: Household Guardian: Soft Terracotta / Sage
  'linear-gradient(135deg, #FFF5EB 0%, #FAF7F2 50%, #EDF8F2 100%); border-color: #FADCCB;',
  // Module 5: Verified Vet: Forest Mint & Soft Coral
  'linear-gradient(135deg, #E6F4ED 0%, #FAF7F2 50%, #FFF1EE 100%); border-color: #BBE3CF;',
  // Module 6: Pet Store & Spa: Warm Coral & Mint
  'linear-gradient(135deg, #FFF1EE 0%, #FAF7F2 50%, #EAF5EF 100%); border-color: #F5D3C8;'
];

let heroIndex = 0;
html = html.replace(/<div class="pet-hero-banner"(?: style="[^"]*")?>/g, (match) => {
  const gradient = heroBannerPastels[heroIndex] || heroBannerPastels[0];
  heroIndex++;
  return `<div class="pet-hero-banner" style="background: ${gradient}">`;
});
console.log(`✓ Processed ${heroIndex} hero banner occurrences in HTML`);

// ==========================================
// 5. UPDATE INLINE STYLES IN HTML BODY
// ==========================================
// Replace header brand icon gradient
html = html.replace(
  'style="background: linear-gradient(135deg, #f59e0b, #ea580c); padding: 2px;"',
  'style="background: linear-gradient(135deg, #E05A47, #EE6C4D); padding: 2px;"'
);

// Profile avatar
html = html.replace(
  'background: linear-gradient(135deg, #f59e0b, #ea580c); display: flex; align-items: center; justify-content: center; color: white; font-weight: 800;',
  'background: linear-gradient(135deg, #E05A47, #EE6C4D); display: flex; align-items: center; justify-content: center; color: white; font-weight: 800;'
);

// Account badge inline
html = html.replace(
  'border: 1.5px solid #0284c7; padding: 0.35rem 0.75rem; border-radius: var(--radius-lg); box-shadow: 0 2px 6px rgba(2, 132, 199, 0.12);',
  'border: 1.5px solid #E05A47; padding: 0.35rem 0.75rem; border-radius: var(--radius-lg); box-shadow: 0 2px 6px rgba(224, 90, 71, 0.12);'
);
html = html.replace('background:#0284c7; width:28px;', 'background:#E05A47; width:28px;');
html = html.replace('color:#0284c7; font-weight:600;', 'color:#E05A47; font-weight:600;');

// Blue badges & tags in body -> Forest Mint or Warm Coral
html = html.replace(
  'style="display: none; color: #0284c7; border-color: #7dd3fc; background: #f0f9ff; font-weight: 700;"',
  'style="display: none; color: #2D6A4F; border-color: #C3E6D5; background: #E8F5EE; font-weight: 700;"'
);
html = html.replace(
  'style="font-size: 0.71rem; padding: 0.15rem 0.45rem; color: #0369a1; border-color: #7dd3fc;"',
  'style="font-size: 0.71rem; padding: 0.15rem 0.45rem; color: #2D6A4F; border-color: #C3E6D5; background: #E8F5EE;"'
);
html = html.replace(
  'style="font-size: 0.72rem; padding: 0.18rem 0.5rem; color: #0369a1; border-color: #7dd3fc;"',
  'style="font-size: 0.72rem; padding: 0.18rem 0.5rem; color: #2D6A4F; border-color: #C3E6D5; background: #E8F5EE;"'
);
html = html.replace(
  'style="background: #e0f2fe; color: #0369a1; font-weight: 700;"',
  'style="background: #E8F5EE; color: #2D6A4F; font-weight: 700;"'
);
html = html.replace(
  'style="font-size: 0.72rem; padding: 0.15rem 0.5rem; background: #eff6ff; color: #0284c7; border: 1px solid #bfdbfe; font-weight: 700;"',
  'style="font-size: 0.72rem; padding: 0.15rem 0.5rem; background: #E8F5EE; color: #2D6A4F; border: 1px solid #C3E6D5; font-weight: 700;"'
);

// Module 6: Spa submit button & inline styles -> Forest Mint or Warm Coral
html = html.replace(
  'style="border-top: 4px solid #0284c7;"',
  'style="border-top: 4px solid #2D6A4F;"'
);
html = html.replace(
  'style="font-size: 0.75rem; font-weight: 700; color: #0284c7; background: #e0f2fe; padding: 0.2rem 0.5rem; border-radius: 4px;"',
  'style="font-size: 0.75rem; font-weight: 700; color: #2D6A4F; background: #E8F5EE; padding: 0.2rem 0.5rem; border-radius: 4px;"'
);
html = html.replace(
  'style="font-size: 0.75rem; font-weight: 600; color: #0284c7; background: #e0f2fe; padding: 0.2rem 0.5rem; border-radius: 4px;"',
  'style="font-size: 0.75rem; font-weight: 600; color: #2D6A4F; background: #E8F5EE; padding: 0.2rem 0.5rem; border-radius: 4px;"'
);
html = html.replace(
  'style="font-size: 1rem; font-weight: 800; color: #0369a1; display: flex; align-items: center; gap: 0.35rem;"',
  'style="font-size: 1rem; font-weight: 800; color: #2D6A4F; display: flex; align-items: center; gap: 0.35rem;"'
);
html = html.replace(
  'style="background: #e0f2fe; color: #0284c7; font-size: 0.72rem; font-weight: 800;"',
  'style="background: #E8F5EE; color: #2D6A4F; font-size: 0.72rem; font-weight: 800;"'
);
html = html.replace(
  'style="font-size: 0.78rem; color: #0369a1;"',
  'style="font-size: 0.78rem; color: #2D6A4F;"'
);
html = html.replace(
  'style="border: 1.5px dashed #0284c7; color: #0284c7; background: #f0f9ff; font-weight: 700; margin-bottom: 1.25rem;"',
  'style="border: 1.5px dashed #2D6A4F; color: #2D6A4F; background: #F3FAF6; font-weight: 700; margin-bottom: 1.25rem;"'
);
html = html.replace(
  'style="background: linear-gradient(135deg, #0284c7, #0369a1); font-weight: 700;"',
  'style="background: linear-gradient(135deg, #2D6A4F, #52B788); font-weight: 700;"'
);
html = html.replace(
  'style="flex: 1.5; background: #0284c7;"',
  'style="flex: 1.5; background: #2D6A4F;"'
);
html = html.replace(
  'style="flex: 1.6; background: #0284c7; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 0.45rem;"',
  'style="flex: 1.6; background: #2D6A4F; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 0.45rem;"'
);
html = html.replace(
  'style="font-size: 0.8rem; color: #0284c7;"',
  'style="font-size: 0.8rem; color: #2D6A4F;"'
);
html = html.replace(
  'style="background: #0284c7; border-color: #0369a1;"',
  'style="background: #2D6A4F; border-color: #22543D;"'
);
html = html.replace(
  'style="width: 32px; height: 32px; background: linear-gradient(135deg, #0284c7, #0369a1); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; color: white;"',
  'style="width: 32px; height: 32px; background: linear-gradient(135deg, #2D6A4F, #52B788); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; color: white;"'
);
html = html.replace(
  'style="background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd;"',
  'style="background: #E8F5EE; color: #2D6A4F; border: 1px solid #C3E6D5;"'
);
html = html.replace(
  'style="font-family: var(--font-display); font-size: 1.3rem; font-weight: 700; margin: 0; color: #0369a1;"',
  'style="font-family: var(--font-display); font-size: 1.3rem; font-weight: 700; margin: 0; color: #2D6A4F;"'
);
html = html.replace(
  'style="font-size: 0.75rem; background: #e0f2fe; color: #0369a1; padding: 0.15rem 0.55rem; border-radius: 999px; font-weight: 800;"',
  'style="font-size: 0.75rem; background: #E8F5EE; color: #2D6A4F; padding: 0.15rem 0.55rem; border-radius: 999px; font-weight: 800;"'
);
html = html.replace(
  'style="display: flex; justify-content: space-between; align-items: center; font-weight: 700; border: 1.5px solid #0284c7; background: #f0f9ff; color: #0369a1; padding: 0.75rem 1rem; border-radius: var(--radius-md);"',
  'style="display: flex; justify-content: space-between; align-items: center; font-weight: 700; border: 1.5px solid #2D6A4F; background: #F3FAF6; color: #2D6A4F; padding: 0.75rem 1rem; border-radius: var(--radius-md);"'
);
html = html.replace(
  'style="background: #0284c7; color: #ffffff; font-size: 0.75rem; padding: 0.2rem 0.6rem; border-radius: 999px; font-weight: 800;"',
  'style="background: #2D6A4F; color: #ffffff; font-size: 0.75rem; padding: 0.2rem 0.6rem; border-radius: 999px; font-weight: 800;"'
);
html = html.replace(
  'style="font-size: 0.85rem; font-weight: 700; color: #0369a1;"',
  'style="font-size: 0.85rem; font-weight: 700; color: #2D6A4F;"'
);
html = html.replace(
  'style="font-size: 0.75rem; color: #0284c7; font-weight: 600; margin-top: 0.3rem;"',
  'style="font-size: 0.75rem; color: #2D6A4F; font-weight: 600; margin-top: 0.3rem;"'
);
html = html.replace(
  'style="font-size: 0.74rem; color: #0284c7; margin-top: 0.25rem; display: block; font-weight: 600;"',
  'style="font-size: 0.74rem; color: #2D6A4F; margin-top: 0.25rem; display: block; font-weight: 600;"'
);
html = html.replace(
  'style="font-size: 0.72rem; color: #0284c7; font-weight: 600;"',
  'style="font-size: 0.72rem; color: #2D6A4F; font-weight: 600;"'
);
html = html.replace(
  'style="background: #0284c7;"',
  'style="background: #2D6A4F;"'
);

// Store CTA buttons: Terracotta / Warm Coral
html = html.replace(
  'style="background: linear-gradient(135deg, #ea580c, #c2410c); font-weight: 700;"',
  'style="background: linear-gradient(135deg, #E05A47, #C84B3A); font-weight: 700;"'
);
html = html.replace(
  'style="flex: 1.5; background: #ea580c;"',
  'style="flex: 1.5; background: #E05A47;"'
);
html = html.replace(
  'style="border: 1.5px dashed #ea580c; color: #ea580c; background: #fff7ed; font-weight: 700; margin-bottom: 1.25rem;"',
  'style="border: 1.5px dashed #E05A47; color: #E05A47; background: #FFF5F2; font-weight: 700; margin-bottom: 1.25rem;"'
);
html = html.replace(
  'style="border-color: #ea580c; color: #ea580c; padding: 0.35rem 0.75rem; font-size: 0.82rem;"',
  'style="border-color: #E05A47; color: #E05A47; padding: 0.35rem 0.75rem; font-size: 0.82rem;"'
);
html = html.replace(
  'style="color: #ea580c; font-weight: 800;"',
  'style="color: #E05A47; font-weight: 800;"'
);
html = html.replace(
  'style="font-size: 0.78rem; font-weight: 800; color: #ea580c; cursor: pointer;"',
  'style="font-size: 0.78rem; font-weight: 800; color: #E05A47; cursor: pointer;"'
);
html = html.replace(
  'style="background: #ea580c; color: white;"',
  'style="background: #E05A47; color: white;"'
);

// Save updated index.html
fs.writeFileSync('index.html', html, 'utf8');
console.log('✓ Successfully written updated index.html! File length: ' + html.length);
