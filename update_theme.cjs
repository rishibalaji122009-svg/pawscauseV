const fs = require('fs');

console.log('Starting theme update...');
let content = fs.readFileSync('index.html', 'utf8');

// 1. Leaderboard badges
const oldBadges = `    /* Badge Emblems */
    .badge-master {
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: #ffffff;
    }
    .badge-diamond {
      background: linear-gradient(135deg, #06b6d4, #0284c7);
      color: #ffffff;
    }
    .badge-elite {
      background: linear-gradient(135deg, #6366f1, #4f46e5);
      color: #ffffff;
    }
    .badge-beginner {
      background: linear-gradient(135deg, #10b981, #059669);
      color: #ffffff;
    }
    .badge-novice {
      background: #94a3b8;
      color: #ffffff;
    }`;

const newBadges = `    /* Badge Emblems - Premium Pet-Tech Terracotta & Mint System */
    .badge-master {
      background: linear-gradient(135deg, #E05A47, #C84B3A);
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(224, 90, 71, 0.25);
    }
    .badge-diamond {
      background: linear-gradient(135deg, #52B788, #2D6A4F);
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(45, 106, 79, 0.25);
    }
    .badge-elite {
      background: linear-gradient(135deg, #EE6C4D, #D97706);
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(238, 108, 77, 0.2);
    }
    .badge-beginner {
      background: linear-gradient(135deg, #74C69D, #52B788);
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(82, 183, 136, 0.2);
    }
    .badge-novice {
      background: #94A3B8;
      color: #ffffff;
    }`;

if (content.includes(oldBadges)) {
  content = content.replace(oldBadges, newBadges);
  console.log('✓ Leaderboard badges updated');
} else {
  console.log('! Old badges string not found exactly, attempting normalized replace');
  const badgeRegex = /\/\*\s*Badge Emblems\s*\*\/[\s\S]*?\.badge-novice\s*\{[\s\S]*?\}/;
  if (badgeRegex.test(content)) {
    content = content.replace(badgeRegex, newBadges);
    console.log('✓ Leaderboard badges updated via regex');
  } else {
    console.warn('✗ Could not match badges');
  }
}

// 2. Base pet-hero-banner styles in <style>
const oldHeroBannerStyle = `    /* Friendly 2D Pet Hero Banners */
    .pet-hero-banner {
      background: linear-gradient(135deg, #fffbeb 0%, #f0fdf4 50%, #eff6ff 100%);
      border: 1.5px solid #fed7aa;
      border-radius: var(--radius-xl);
      padding: 1.25rem 1.5rem;
      margin-bottom: 1.75rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.25rem;
      box-shadow: 0 2px 8px -2px rgba(245, 158, 11, 0.08);
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
      background: #fef3c7;
      color: #b45309;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.2rem 0.65rem;
      border-radius: 9999px;
      margin-bottom: 0.4rem;
      border: 1px solid #fde68a;
    }
    .pet-hero-title {
      font-family: var(--font-display);
      font-size: 1.35rem;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.02em;
    }
    .pet-hero-text {
      font-size: 0.875rem;
      color: #475569;
      margin-top: 0.25rem;
      max-width: 680px;
      line-height: 1.45;
    }`;

const newHeroBannerStyle = `    /* Friendly 2D Pet Hero Banners - Warm Coral & Sage Mint Aesthetic */
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

if (content.includes(oldHeroBannerStyle)) {
  content = content.replace(oldHeroBannerStyle, newHeroBannerStyle);
  console.log('✓ Hero banner base style updated');
} else {
  console.log('! Base hero banner style not found exactly, attempting normalized replace');
  const heroStyleRegex = /\/\*\s*Friendly 2D Pet Hero Banners\s*\*\/[\s\S]*?\.pet-hero-text\s*\{[\s\S]*?\}/;
  if (heroStyleRegex.test(content)) {
    content = content.replace(heroStyleRegex, newHeroBannerStyle);
    console.log('✓ Hero banner base style updated via regex');
  } else {
    console.warn('✗ Could not match hero banner style');
  }
}

// 3. Update the 6 module hero banners in HTML
// Module 1: Pet Registration
const oldMod1 = '<div class="pet-hero-banner">';
const newMod1 = '<div class="pet-hero-banner" style="background: linear-gradient(135deg, #FFF1EE 0%, #FAF7F2 50%, #E8F5EE 100%); border-color: #F8D5CE;">';

// Module 2: Street Guardian Network
const oldMod2 = '<div class="pet-hero-banner" style="background: linear-gradient(135deg, #f0fdf4 0%, #ecfeff 50%, #eff6ff 100%); border-color: #a7f3d0;">';
const newMod2 = '<div class="pet-hero-banner" style="background: linear-gradient(135deg, #EBF6F0 0%, #FAF7F2 50%, #FFF1EE 100%); border-color: #C3E6D5;">';

// Module 3: Community Rescue Champions
const oldMod3 = '<div class="pet-hero-banner" style="background: linear-gradient(135deg, #fefce8 0%, #e0e7ff 50%, #f5f3ff 100%); border-color: #c7d2fe;">';
const newMod3 = '<div class="pet-hero-banner" style="background: linear-gradient(135deg, #FFF0EC 0%, #F5FBF7 50%, #EBF6F0 100%); border-color: #F6CECE;">';

// Module 4: Household Guardian Hub
const oldMod4 = '<div class="pet-hero-banner" style="background: linear-gradient(135deg, #fef3c7 0%, #fff7ed 50%, #eff6ff 100%); border-color: #fde68a;">';
const newMod4 = '<div class="pet-hero-banner" style="background: linear-gradient(135deg, #FFF5EB 0%, #FAF7F2 50%, #EDF8F2 100%); border-color: #FADCCB;">';

// Module 5: Verified Veterinary Network
const oldMod5 = '<div class="pet-hero-banner" style="background: linear-gradient(135deg, #ecfeff 0%, #e0f2fe 50%, #f0fdf4 100%); border-color: #7dd3fc;">';
const newMod5 = '<div class="pet-hero-banner" style="background: linear-gradient(135deg, #E6F4ED 0%, #F3FAF6 50%, #FFF2EE 100%); border-color: #BBE3CF;">';

// Module 6: Pet Essentials Stores & Spas
const oldMod6 = '<div class="pet-hero-banner" style="background: linear-gradient(135deg, #fff7ed, #ffedd5); border-color: #fed7aa;">';
const newMod6 = '<div class="pet-hero-banner" style="background: linear-gradient(135deg, #FDF0EB 0%, #FAF7F2 50%, #EAF5EF 100%); border-color: #F5D3C8;">';

if (content.includes(oldMod1)) {
  content = content.replace(oldMod1, newMod1);
  console.log('✓ Module 1 Hero Banner updated');
} else {
  console.warn('✗ Module 1 Hero Banner not found');
}

if (content.includes(oldMod2)) {
  content = content.replace(oldMod2, newMod2);
  console.log('✓ Module 2 Hero Banner updated');
} else {
  console.warn('✗ Module 2 Hero Banner not found');
}

if (content.includes(oldMod3)) {
  content = content.replace(oldMod3, newMod3);
  console.log('✓ Module 3 Hero Banner updated');
} else {
  console.warn('✗ Module 3 Hero Banner not found');
}

if (content.includes(oldMod4)) {
  content = content.replace(oldMod4, newMod4);
  console.log('✓ Module 4 Hero Banner updated');
} else {
  console.warn('✗ Module 4 Hero Banner not found');
}

if (content.includes(oldMod5)) {
  content = content.replace(oldMod5, newMod5);
  console.log('✓ Module 5 Hero Banner updated');
} else {
  console.warn('✗ Module 5 Hero Banner not found');
}

if (content.includes(oldMod6)) {
  content = content.replace(oldMod6, newMod6);
  console.log('✓ Module 6 Hero Banner updated');
} else {
  console.warn('✗ Module 6 Hero Banner not found');
}

// 4. Update the badges inside the 6 hero banners to match earthy / coral / mint palettes
content = content.replace(
  'style="background: #dcfce7; color: #15803d; border-color: #bbf7d0;"',
  'style="background: #E8F5EE; color: #2D6A4F; border-color: #C3E6D5;"'
);
content = content.replace(
  'style="background: #e0e7ff; color: #4338ca; border-color: #c7d2fe;"',
  'style="background: #FFE8E2; color: #C84B3A; border-color: #F8CCC0;"'
);
content = content.replace(
  'style="background: #ffedd5; color: #c2410c; border-color: #fed7aa;"',
  'style="background: #FFF0EC; color: #E05A47; border-color: #F8CCC0;"'
);
content = content.replace(
  'style="background: #e0f2fe; color: #0369a1; border-color: #bae6fd;"',
  'style="background: #E8F5EE; color: #2D6A4F; border-color: #BBE3CF;"'
);

// 5. Update card box-shadow & pure black text removal in <style>
// Search for box-shadow on cards in <style>
content = content.replace(
  /box-shadow:\s*0\s+4px\s+6px\s+-1px\s+rgba\(0,\s*0,\s*0,\s*0\.1\)/g,
  'box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05)'
);

// Replace hardcoded pure black #000000 in color: #000000 with #1E293B
content = content.replace(/color:\s*#000000\b/gi, 'color: #1E293B');
content = content.replace(/color:\s*black\b/gi, 'color: #1E293B');

fs.writeFileSync('index.html', content, 'utf8');
console.log('Successfully updated index.html!');
