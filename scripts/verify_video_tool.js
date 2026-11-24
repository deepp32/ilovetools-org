async function verifyVideoTool() {
  const url = 'https://www.ilovetools.org/compress-video';
  const res = await fetch(url);
  console.log('Status:', res.status);
  const html = await res.text();
  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  const title = titleMatch ? titleMatch[1] : 'NOT FOUND';
  console.log('Title:', title, 'Length:', title.length);
  const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
  const desc = descMatch ? descMatch[1] : 'NOT FOUND';
  console.log('Desc:', desc, 'Length:', desc.length);
  console.log('Has Video Compression studio:', html.includes('Video Compression') || html.includes('compress-video'));
}

verifyVideoTool().catch(console.error);
