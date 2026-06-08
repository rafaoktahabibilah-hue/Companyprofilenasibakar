const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

const SCALE = 2.5;
const TOTAL_PAGES = 169;
const NUM_CH = 5;
const base = Math.floor(TOTAL_PAGES / NUM_CH);
const extra = TOTAL_PAGES % NUM_CH;
const pagesPerCh = Array.from({length: NUM_CH}, (_, i) => base + (i < extra ? 1 : 0));

// Maps: ch index -> [startPageInPdf, endPageInPdf]
let offset = 1;
const chPageRanges = pagesPerCh.map(count => {
  const r = [offset, offset + count - 1];
  offset += count;
  return r;
});

async function extractPages(pdfPath, outputDir, startPage, endPage) {
  const data = new Uint8Array(fs.readFileSync(pdfPath));

  const pdfjsLib = await import('pdfjs-dist');
  const doc = await pdfjsLib.getDocument({ data }).promise;
  fs.mkdirSync(outputDir, { recursive: true });

  const numPages = Math.min(endPage, doc.numPages);
  console.log(`  PDF pages ${startPage}-${numPages} at scale ${SCALE}`);

  let outPage = 1;
  for (let i = startPage; i <= numPages; i++) {
    const page = await doc.getPage(i);
    const viewport = page.getViewport({ scale: SCALE });
    const w = Math.floor(viewport.width);
    const h = Math.floor(viewport.height);

    const canvas = createCanvas(w, h);
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, w, h);

    await page.render({ canvasContext: ctx, viewport }).promise;

    const outPath = path.join(outputDir, `page${outPage}.jpg`);
    const buf = canvas.toBuffer('image/jpeg', { quality: 85 });
    fs.writeFileSync(outPath, buf);

    if (outPage % 5 === 0 || outPage === numPages) {
      console.log(`  Page ${outPage}/${numPages - startPage + 1} done`);
    }
    outPage++;
  }

  console.log(`  Saved ${outPage-1} pages to ${outputDir}/`);
}

const items = [
  {
    id: 're-zero',
    pdf: 're zero/Re Zero kara Hajimeru Isekai Seikatsu - Daisanshou - Truth of Zero - c006-010 (v02) [One Time Scans].pdf',
  },
  {
    id: 'cote-vol1',
    // Each volume is a separate PDF, so no page ranges needed
    chapters: [
      { pdf: 'Kumpulannovel/novel1.pdf', ch: 1 },
      { pdf: 'Kumpulannovel/novel2.pdf', ch: 2 },
      { pdf: 'Kumpulannovel/novel3.pdf', ch: 3 },
    ],
  },
];

(async () => {
  // Delete old Pages directories
  for (const item of items) {
    const dir = path.join(__dirname, 'Pages', item.id);
    if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
  }

  // Process re-zero (single PDF, 5 chapters with page ranges)
  console.log(`\n=== Processing: re-zero ===`);
  const reZero = items[0];
  const pdfPath = path.resolve(__dirname, reZero.pdf);
  if (fs.existsSync(pdfPath)) {
    for (let ch = 1; ch <= NUM_CH; ch++) {
      const [start, end] = chPageRanges[ch-1];
      const outDir = path.join(__dirname, 'Pages', reZero.id, `ch${ch}`);
      console.log(`\n  ch${ch} (PDF pages ${start}-${end}):`);
      await extractPages(pdfPath, outDir, start, end);
    }
  } else {
    console.log(`  SKIP: ${reZero.pdf} not found`);
  }

  // Process novel volumes (separate PDFs)
  console.log(`\n=== Processing: cote-vol1 ===`);
  for (const ch of items[1].chapters) {
    const p = path.resolve(__dirname, ch.pdf);
    if (!fs.existsSync(p)) {
      console.log(`  SKIP: ${ch.pdf} not found`);
      continue;
    }
    const outDir = path.join(__dirname, 'Pages', 'cote-vol1', `ch${ch.ch}`);
    console.log(`\n  Volume ${ch.ch}: ${ch.pdf}`);
    await extractPages(p, outDir, 1, 9999);
  }

  console.log('\n=== All done! ===');
})().catch(e => { console.error('Error:', e); process.exit(1); });
