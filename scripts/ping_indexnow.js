const fs = require('fs');
const path = require('path');

const KEY = '166faff8ee731b75b930f94e743dbbe6';
const HOST = 'www.ilovetools.org';
const BASE_URL = `https://${HOST}`;

// Read tools from tools.ts
const toolsFile = path.join(__dirname, '../src/config/tools.ts');
const toolsContent = fs.readFileSync(toolsFile, 'utf8');
const slugs = [];
const slugMatches = toolsContent.matchAll(/slug:\s*'([a-zA-Z0-9-_]+)'/g);
for (const match of slugMatches) {
  if (!slugs.includes(match[1])) {
    slugs.push(match[1]);
  }
}

const urlList = [
  `${BASE_URL}/`,
  `${BASE_URL}/privacy`,
  `${BASE_URL}/terms`,
  ...slugs.map(s => `${BASE_URL}/${s}`)
];

console.log(`Found ${urlList.length} URLs to submit to IndexNow:`);
console.log(urlList);

const payload = {
  host: HOST,
  key: KEY,
  keyLocation: `${BASE_URL}/${KEY}.txt`,
  urlList: urlList
};

async function pingIndexNow() {
  const endpoints = [
    'https://api.indexnow.org/indexnow',
    'https://www.bing.com/indexnow'
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`\nSubmitting to ${endpoint}...`);
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(payload)
      });
      console.log(`Result from ${endpoint}: HTTP ${res.status} ${res.statusText}`);
      const text = await res.text();
      if (text) console.log('Response body:', text);
    } catch (err) {
      console.error(`Error pinging ${endpoint}:`, err.message);
    }
  }
}

pingIndexNow();
