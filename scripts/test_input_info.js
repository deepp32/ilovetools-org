const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://omnitools-web-deep-ec48.vercel.app/compress-video', { waitUntil: 'domcontentloaded' });

  const samplePath = path.resolve(__dirname, '..', 'sample_test.mp4');
  const sampleBase64 = fs.readFileSync(samplePath).toString('base64');

  const info = await page.evaluate(async (b64) => {
    const { 
      Input, 
      ALL_FORMATS, 
      BlobSource, 
    } = await import('https://esm.sh/mediabunny');

    const binary = atob(b64);
    const array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) array[i] = binary.charCodeAt(i);
    const file = new File([array], 'sample_test.mp4', { type: 'video/mp4' });

    const input = new Input({
      source: new BlobSource(file),
      formats: ALL_FORMATS,
    });

    const tracks = await input.getTracks();
    const videoTrack = tracks.find(t => t.type === 'video');

    return {
      duration: await input.computeDuration(),
      trackCount: tracks.length,
      videoWidth: videoTrack ? videoTrack.displayWidth : null,
      videoHeight: videoTrack ? videoTrack.displayHeight : null,
    };
  }, sampleBase64);

  console.log('Input info:', info);
  await browser.close();
})();
