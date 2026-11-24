const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const res = await page.evaluate(async () => {
    let encoderSupport = false;
    if (typeof VideoEncoder !== 'undefined') {
      try {
        const support = await VideoEncoder.isConfigSupported({
          codec: 'avc1.42001E',
          width: 640,
          height: 360,
          bitrate: 1_000_000,
          framerate: 30,
        });
        encoderSupport = support.supported;
      } catch (e) {
        encoderSupport = false;
      }
    }
    return {
      hasVideoDecoder: typeof VideoDecoder !== 'undefined',
      hasVideoEncoder: typeof VideoEncoder !== 'undefined',
      encoderSupport,
      hasMediaRecorder: typeof MediaRecorder !== 'undefined',
      mp4Avc1: MediaRecorder.isTypeSupported('video/mp4;codecs=avc1'),
      mp4: MediaRecorder.isTypeSupported('video/mp4'),
      webm: MediaRecorder.isTypeSupported('video/webm')
    };
  });
  console.log('Browser Capabilities:', res);
  await browser.close();
})();
