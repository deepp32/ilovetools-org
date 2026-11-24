const fs = require('fs');
const content = fs.readFileSync('src/config/tools.ts', 'utf8');

// Match id, slug, metaTitle, metaDescription
const toolBlocks = content.split(/id:\s*'/).slice(1);
console.log('Total tool blocks:', toolBlocks.length);

for (const block of toolBlocks) {
  const idMatch = block.match(/^([^']+)'/);
  const slugMatch = block.match(/slug:\s*'([^']+)'/);
  const titleMatch = block.match(/metaTitle:\s*'([^']+)'/);
  const descMatch = block.match(/metaDescription:\s*'([^']+)'/);

  const id = idMatch ? idMatch[1] : 'unknown';
  const slug = slugMatch ? slugMatch[1] : id;
  const metaTitle = titleMatch ? titleMatch[1] : '';
  const metaDesc = descMatch ? descMatch[1] : '';

  // Rendered title in Next.js: `${metaTitle} | iLoveTools`
  const renderedTitle = `${metaTitle} | iLoveTools`;
  
  if (renderedTitle.length > 60 || renderedTitle.length < 20 || metaDesc.length > 160 || metaDesc.length < 50) {
    console.log(`Tool: /${slug}`);
    console.log(`  Rendered Title (${renderedTitle.length} chars): "${renderedTitle}"`);
    console.log(`  Meta Desc (${metaDesc.length} chars): "${metaDesc}"`);
  }
}
