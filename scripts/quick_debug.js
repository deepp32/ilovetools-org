const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  console.log('Navigating to https://www.ilovetools.org/compress-video...');
  await page.goto('https://www.ilovetools.org/compress-video', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  const inputs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('input')).map(i => ({ id: i.id, type: i.type, name: i.name, className: i.className }));
  });
  console.log('Inputs found:', JSON.stringify(inputs));

  // Try fileChooser
  console.log('Waiting for file chooser...');
  const fileChooserPromise = page.waitForEvent('filechooser');
  await page.click('button:has-text("Select File")');
  const fileChooser = await fileChooserPromise;
  const samplePath = path.resolve(__dirname, '..', 'sample_test.mp4');
  console.log('Setting file via fileChooser:', samplePath);
  await fileChooser.setFiles(samplePath);

  await page.waitForTimeout(2500);
  const hasButtons = await page.locator('text=Select Compression Level').count();
  console.log('Has Select Compression Level after fileChooser:', hasButtons);

  await page.screenshot({ path: path.join(__dirname, '..', 'test_debug_shot.png') });
  await browser.close();
})();
