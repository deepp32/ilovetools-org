const https = require('https');
const fs = require('fs');
const path = require('path');

const toolsFile = path.join(__dirname, '../src/config/tools.ts');
const toolsContent = fs.readFileSync(toolsFile, 'utf8');
const slugs = [];
const slugMatches = toolsContent.matchAll(/slug:\s*'([a-zA-Z0-9-_]+)'/g);
for (const match of slugMatches) {
  if (!slugs.includes(match[1])) {
    slugs.push(match[1]);
  }
}

const allUrls = [
  'https://www.ilovetools.org/',
  'https://www.ilovetools.org/privacy',
  'https://www.ilovetools.org/terms',
  ...slugs.map(s => `https://www.ilovetools.org/${s}`)
];

async function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const hasH1 = /<h1/i.test(data);
        const hasDesc = /name=["']description["']/i.test(data);
        const h1Match = data.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]*>/g, '').trim();
        const descMatch = data.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i)?.[1];
        resolve({
          url,
          status: res.statusCode,
          hasH1,
          hasDesc,
          h1: h1Match,
          descLen: descMatch?.length || 0
        });
      });
    }).on('error', err => resolve({ url, error: err.message }));
  });
}

(async () => {
  console.log(`Auditing all ${allUrls.length} live production pages...`);
  let issues = 0;
  for (const url of allUrls) {
    const res = await checkUrl(url);
    if (!res.hasH1 || !res.hasDesc || res.status !== 200) {
      console.log(`❌ ISSUE on ${res.url}: status=${res.status}, hasH1=${res.hasH1}, hasDesc=${res.hasDesc}`);
      issues++;
    } else {
      console.log(`✓ ${res.url.padEnd(50)} [Status: ${res.status}] [h1: "${res.h1?.substring(0, 30)}..."] [desc: ${res.descLen}c]`);
    }
  }
  console.log(`\nAudit finished: ${issues} issues found across ${allUrls.length} live pages.`);
})();
