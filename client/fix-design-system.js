const fs = require('fs');
const path = require('path');

// Recursively find all .tsx files in src
function findFiles(dir, ext = '.tsx') {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(findFiles(filePath, ext));
    } else if (file.endsWith(ext)) {
      results.push(filePath);
    }
  });
  return results;
}

const srcDir = 'D:/p hero/luxespace/client/src';
const files = findFiles(srcDir);

const replacements = [
  // Background colors
  [/bg-\[#0B0F1A\]/g, 'bg-background'],
  [/bg-\[#121826\]/g, 'bg-card'],
  [/from-\[#0B0F1A\]/g, 'from-background'],
  [/via-\[#0B0F1A\]/g, 'via-background'],
  [/to-\[#0B0F1A\]/g, 'to-background'],
  [/border-\[#0B0F1A\]/g, 'border-background'],
  
  // Text colors
  [/text-\[#FFFFFF\]/g, 'text-foreground'],
  [/text-\[#9CA3AF\]/g, 'text-muted-foreground'],
  [/text-\[#C9A74D\]/g, 'text-primary'],
  
  // Border colors
  [/border-\[#1E293B\]/g, 'border-border'],
  [/border-\[#C9A74D\]/g, 'border-primary'],
  [/border-\[#C9A74D\/\d+\]/g, (match) => {
    const opacity = match.match(/\/(\d+)\]/)?.[1] || '20';
    return `border-primary/${opacity}`;
  }],
  
  // Background with opacity
  [/bg-\[#0B0F1A\/\d+\]/g, (match) => {
    const opacity = match.match(/\/(\d+)\]/)?.[1] || '75';
    return `bg-background/${opacity}`;
  }],
  [/bg-\[#121826\]/g, 'bg-card'],
  [/bg-\[#121826\/\d+\]/g, (match) => {
    const opacity = match.match(/\/(\d+)\]/)?.[1] || '80';
    return `bg-card/${opacity}`;
  }],
  [/bg-\[#C9A74D\]/g, 'bg-primary'],
  [/bg-\[#C9A74D\/\d+\]/g, (match) => {
    const opacity = match.match(/\/(\d+)\]/)?.[1] || '10';
    return `bg-primary/${opacity}`;
  }],
  
  // Text with opacity
  [/text-\[#C9A74D\/\d+\]/g, (match) => {
    const opacity = match.match(/\/(\d+)\]/)?.[1] || '20';
    return `text-primary/${opacity}`;
  }],
  
  // Gradient colors
  [/from-\[#C9A74D\]/g, 'from-primary'],
  [/via-\[#C9A74D\]/g, 'via-primary'],
  [/to-\[#C9A74D\]/g, 'to-primary'],
  [/via-transparent/g, 'via-transparent'],
  
  // Shadow colors
  [/shadow-\[#C9A74D\/\d+\]/g, (match) => {
    const opacity = match.match(/\/(\d+)\]/)?.[1] || '20';
    return `shadow-primary/${opacity}`;
  }],
  
  // Muted foreground
  [/text-\[#9CA3AF\]/g, 'text-muted-foreground'],
  
  // Secondary color
  [/text-\[#0B0F1A\]/g, 'text-secondary-foreground'],
  [/bg-\[#0B0F1A\]/g, 'bg-secondary'],
];

let totalReplacements = 0;
files.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  let fileReplacements = 0;
  
  replacements.forEach(([pattern, replacement]) => {
    const matches = content.match(pattern);
    if (matches) {
      content = content.replace(pattern, replacement);
      fileReplacements += matches.length;
    }
  });
  
  if (fileReplacements > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    totalReplacements += fileReplacements;
    console.log(`${filePath}: ${fileReplacements} replacements`);
  }
});

console.log(`\nTotal replacements: ${totalReplacements}`);
