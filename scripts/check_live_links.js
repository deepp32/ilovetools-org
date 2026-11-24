async function checkLiveLinks() {
  const urls = [
    'https://www.ilovetools.org/',
    'https://www.ilovetools.org/image-to-pdf',
    'https://www.ilovetools.org/pdf-to-excel',
    'https://www.ilovetools.org/compress-image',
    'https://www.ilovetools.org/merge-pdf',
  ];

  for (const url of urls) {
    const res = await fetch(url);
    const html = await res.text();
    const titleMatch = html.match(/<title>([^<]+)<\/title>/);
    const descMatch = html.match(/<meta name="description" content="([^"]+)"/);

    const title = titleMatch ? titleMatch[1] : '';
    const desc = descMatch ? descMatch[1] : '';

    console.log(url);
    console.log('  Title (' + title.length + ' chars):', title);
    console.log('  Desc (' + desc.length + ' chars):', desc);
  }
}
checkLiveLinks();
