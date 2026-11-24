const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

const toolsContent = fs.readFileSync(path.join(root, 'src/config/tools.ts'), 'utf8');
const slugs = [...toolsContent.matchAll(/slug:\s*'([a-zA-Z0-9-_]+)'/g)].map(m => m[1]);
const uniqueSlugs = [...new Set(slugs)];

console.log('--- FOUNDATION AUDIT REPORT ---');
console.log('Total unique tools configured:', uniqueSlugs.length);
console.log('Public assets:');
console.log('- manifest.json:', fs.existsSync(path.join(root, 'public/manifest.json')));
console.log('- ads.txt:', fs.existsSync(path.join(root, 'public/ads.txt')));
console.log('- llms.txt:', fs.existsSync(path.join(root, 'public/llms.txt')));
console.log('- llms-full.txt:', fs.existsSync(path.join(root, 'public/llms-full.txt')));
console.log('- producthunt_gallery.jpg:', fs.existsSync(path.join(root, 'public/producthunt_gallery.jpg')));
console.log('- robots.txt (in public):', fs.existsSync(path.join(root, 'public/robots.txt')));
console.log('- robots.ts (dynamic):', fs.existsSync(path.join(root, 'src/app/robots.ts')));
console.log('- sitemap.ts (dynamic):', fs.existsSync(path.join(root, 'src/app/sitemap.ts')));
console.log('- not-found.tsx (404 handler):', fs.existsSync(path.join(root, 'src/app/not-found.tsx')));
console.log('- proxy.ts (edge firewall):', fs.existsSync(path.join(root, 'src/proxy.ts')));
