const fs = require('fs');
const path = require('path');

const bannedTerms = [
  { term: '—', name: 'Em dash (unicode)' },
  { term: '&mdash;', name: 'Em dash (HTML entity)' },
  { term: 'Made with', name: 'Builder badge phrase' },
  { term: 'Lovable', name: 'Banned platform name' },
  { term: 'Bolt', name: 'Banned platform name' },
  { term: 'Base44', name: 'Banned platform name' },
  { term: 'Antigravity', name: 'Banned internal platform string' },
  { term: 'lorem ipsum', name: 'Lorem ipsum placeholder' },
  { term: 'testimonial', name: 'Fake testimonial term' },
  { term: '10,000+', name: 'Fake metrics counter' },
  { term: 'unlock', name: 'Banned buzzword' },
  { term: 'elevate', name: 'Banned buzzword' },
  { term: 'seamless', name: 'Banned buzzword' },
  { term: 'cutting-edge', name: 'Banned buzzword' },
  { term: 'revolutionize', name: 'Banned buzzword' },
  { term: 'backdrop-filter', name: 'Glassmorphism backdrop-filter CSS' }
];

// Check for emojis
const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;

const scannedDirs = [
  path.join(__dirname, '..', 'client', 'src'),
  path.join(__dirname, '..', 'server', 'src')
];

let failures = [];

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');

  // Check banned terms (case-insensitive for text)
  bannedTerms.forEach(({ term, name }) => {
    if (content.toLowerCase().includes(term.toLowerCase())) {
      failures.push({
        file: filePath,
        issue: `Found banned term '${term}' (${name})`
      });
    }
  });

  // Check for emojis
  if (emojiRegex.test(content)) {
    failures.push({
      file: filePath,
      issue: 'Found Unicode emoji character'
    });
  }

  // Check for 'rounded-full' on buttons specifically
  if (/class(Name)?=.*rounded-full.*(button|<button|lab-btn)/i.test(content)) {
    failures.push({
      file: filePath,
      issue: 'Found rounded-full on button or interactive control'
    });
  }

  // Check for gradient CSS classes
  if (/bg-gradient|linear-gradient|radial-gradient/i.test(content)) {
    failures.push({
      file: filePath,
      issue: 'Found gradient CSS class or property'
    });
  }
}

function traverse(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      traverse(fullPath);
    } else if (/\.(jsx?|tsx?|css|html|json|md)$/.test(entry.name)) {
      scanFile(fullPath);
    }
  }
}

scannedDirs.forEach(dir => traverse(dir));

console.log('--- Verification Report for Banned Patterns ---');
if (failures.length === 0) {
  console.log('PASS: Zero banned terms, zero emojis, zero em dashes, zero gradients, zero backdrop-filters, zero rounded-full buttons found in source code.');
  process.exit(0);
} else {
  console.error(`FAIL: Found ${failures.length} issues:`);
  failures.forEach(f => console.error(`- ${f.file}: ${f.issue}`));
  process.exit(1);
}
