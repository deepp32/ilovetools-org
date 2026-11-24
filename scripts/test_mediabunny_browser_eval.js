const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto('https://omnitools-web-deep-ec48.vercel.app/compress-video', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  const samplePath = path.resolve(__dirname, '..', 'sample_test.mp4');
  const sampleBase64 = fs.readFileSync(samplePath).toString('base64');

  const playbackVerification = await page.evaluate(async (b64) => {
    const { 
      Input, 
      Output, 
      Conversion, 
      ALL_FORMATS, 
      BlobSource, 
      BufferTarget, 
      Mp4OutputFormat, 
      Quality 
    } = await import('https://esm.sh/mediabunny');

    const binary = atob(b64);
    const array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) array[i] = binary.charCodeAt(i);
    const file = new File([array], 'sample_test.mp4', { type: 'video/mp4' });

    const input = new Input({
      source: new BlobSource(file),
      formats: ALL_FORMATS,
    });

    const output = new Output({
      format: new Mp4OutputFormat(),
      target: new BufferTarget(),
    });

    const conversion = await Conversion.init({
      input,
      output,
      video: {
        codec: 'avc',
        quality: new Quality('medium'),
      },
      audio: {
        codec: 'aac',
        quality: new Quality('medium'),
      }
    });

    await conversion.execute();
    const outBuffer = output.target.buffer;
    const blob = new Blob([outBuffer], { type: 'video/mp4' });
    const blobUrl = URL.createObjectURL(blob);

    // Test playback in HTML5 video element
    const v = document.createElement('video');
    v.src = blobUrl;
    v.muted = true;

    await new Promise((resolve, reject) => {
      v.onloadedmetadata = resolve;
      v.onerror = (e) => reject(new Error('Video playback error'));
      setTimeout(() => reject(new Error('Timeout loading metadata')), 5000);
    });

    return {
      duration: v.duration,
      videoWidth: v.videoWidth,
      videoHeight: v.videoHeight,
      readyState: v.readyState,
      fileSize: blob.size,
    };
  }, sampleBase64);

  console.log('Playback Verification:', JSON.stringify(playbackVerification, null, 2));
  await browser.close();
})();
