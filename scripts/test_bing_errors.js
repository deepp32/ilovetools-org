const https = require('https');

async function testUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          url,
          status: res.statusCode,
          headers: res.headers,
          hasH1: /<h1/i.test(data),
          hasDesc: /name=["']description["']/i.test(data),
          titleMatch: data.match(/<title>([^<]*)<\/title>/i)?.[1],
          snippet: data.substring(0, 1000)
        });
      });
    }).on('error', (err) => resolve({ url, error: err.message }));
  });
}

(async () => {
  const urls = [
    'https://ilovetools.org/bitcoin-address-generator/',
    'https://www.ilovetools.org/bitcoin-address-generator',
    'https://www.ilovetools.org/heart-symbols-unicode/',
    'https://www.ilovetools.org/heart-symbols-unicode',
    'https://www.ilovetools.org/some-random-nonexistent-tool'
  ];

  for (const u of urls) {
    const res = await testUrl(u);
    console.log('\n=======================================');
    console.log('URL:', res.url);
    console.log('Status:', res.status);
    console.log('Location:', res.headers?.location);
    console.log('Has H1:', res.hasH1);
    console.log('Has Meta Description:', res.hasDesc);
    console.log('Title:', res.titleMatch);
    if (res.status === 200 || res.status === 404) {
      console.log('Body snippet:\n', res.snippet.substring(0, 400));
    }
  }
})();
