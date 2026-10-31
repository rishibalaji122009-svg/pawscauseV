const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');
const styleMatch = content.match(/<style[^>]*>([\s\S]*?)<\/style>/);
if (!styleMatch) {
  console.log('No style block found');
  process.exit(1);
}

const styleContent = styleMatch[1];
console.log('Style block length:', styleContent.length);

// Count occurrences of legacy colors inside <style>
const occurrences = {
  '#0284c7': (styleContent.match(/#0284c7/gi) || []).length,
  '#0369a1': (styleContent.match(/#0369a1/gi) || []).length,
  '#0ea5e9': (styleContent.match(/#0ea5e9/gi) || []).length,
  '#0f172a': (styleContent.match(/#0f172a/gi) || []).length,
  '#000000': (styleContent.match(/#000000/gi) || []).length,
  '#1e293b': (styleContent.match(/#1e293b/gi) || []).length,
  '--brand-primary': (styleContent.match(/--brand-primary/gi) || []).length,
  '--brand-emerald': (styleContent.match(/--brand-emerald/gi) || []).length,
};

console.log('Color scan inside <style>:', JSON.stringify(occurrences, null, 2));

// Let's inspect which rules contain #0284c7, #0369a1, #0ea5e9
const lines = styleContent.split('\n');
const legacyLines = [];
lines.forEach((line, i) => {
  if (/#0284c7|#0369a1|#0ea5e9/i.test(line)) {
    legacyLines.push({ lineNum: i + 1, line: line.trim() });
  }
});

console.log('Legacy blue occurrences in style:', legacyLines.slice(0, 20));
