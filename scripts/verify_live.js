async function verify() {
  const url = 'https://www.ilovetools.org/compress-image-to-100kb';
  const res = await fetch(url);
  console.log('Status:', res.status);
  const html = await res.text();
  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  const title = titleMatch ? titleMatch[1] : 'NOT FOUND';
  console.log('Title:', title, 'Length:', title.length);
  const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
  const desc = descMatch ? descMatch[1] : 'NOT FOUND';
  console.log('Desc:', desc, 'Length:', desc.length);

  const sitemapRes = await fetch('https://www.ilovetools.org/sitemap.xml');
  const sitemapXml = await sitemapRes.text();
  console.log('In sitemap?', sitemapXml.includes('compress-image-to-100kb'));
}

verify().catch(console.error);
