const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://omnitools-web-deep-ec48.vercel.app/compress-video', { waitUntil: 'domcontentloaded' });

  const samplePath = path.resolve(__dirname, '..', 'sample_test.mp4');
  const sampleBase64 = fs.readFileSync(samplePath).toString('base64');

  const res = await page.evaluate(async (b64) => {
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
        quality: new Quality({ bitrate: 200_000 }),
      },
      audio: {
        codec: 'aac',
        quality: new Quality('low'),
      }
    });

    await conversion.execute();
    return {
      outputSize: output.target.buffer.byteLength,
      isValid: conversion.isValid,
    };
  }, sampleBase64);

  console.log('Target bitrate test:', res);
  await browser.close();
})();
