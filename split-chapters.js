const fs = require('fs');
const path = require('path');

const TOTAL = 169;
const NUM_CH = 5;
const base = Math.floor(TOTAL / NUM_CH);
const extra = TOTAL % NUM_CH;
const pagesPerCh = Array.from({length: NUM_CH}, (_, i) => base + (i < extra ? 1 : 0));

console.log('Pages per chapter:', pagesPerCh.join(', '));
console.log('Total:', pagesPerCh.reduce((a,b) => a+b, 0));

const srcDir = path.join(__dirname, 'Pages', 're-zero', 'ch1');
let srcPage = 1;

for (let ch = 1; ch <= NUM_CH; ch++) {
  const dstDir = path.join(__dirname, 'Pages', 're-zero', `ch${ch}`);
  if (ch !== 1) fs.mkdirSync(dstDir, { recursive: true });
  
  for (let p = 1; p <= pagesPerCh[ch-1]; p++) {
    const srcFile = path.join(srcDir, `page${srcPage}.jpg`);
    const dstFile = ch === 1
      ? path.join(srcDir, `page${p}.jpg`)
      : path.join(dstDir, `page${p}.jpg`);
    
    if (!fs.existsSync(srcFile)) {
      console.log(`  WARN: page${srcPage}.jpg not found`);
      srcPage++;
      continue;
    }
    
    if (ch === 1) {
      // Rename in-place (sequential)
      if (srcPage !== p) fs.renameSync(srcFile, dstFile);
    } else {
      fs.renameSync(srcFile, dstFile);
    }
    srcPage++;
  }
  console.log(`  ch${ch}: ${pagesPerCh[ch-1]} pages`);
}

console.log('Done!');
