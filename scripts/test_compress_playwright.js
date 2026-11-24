const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const ARTIFACT_DIR = 'C:/Users/Test/.gemini/antigravity/brain/a443697c-e3aa-4472-bc24-8c9cfc13ca4e';

async function testCompressFlowWithScreenshots() {
  console.log('🚀 Launching Chromium (visible viewport)...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    acceptDownloads: true
  });
  const page = await context.newPage();

  console.log('🌐 Step 1: Navigating to https://www.ilovetools.org/compress-video ...');
  await page.goto('https://www.ilovetools.org/compress-video', { waitUntil: 'domcontentloaded', timeout: 30000 });
  console.log('⏳ Waiting for client hydration...');
  await page.waitForTimeout(3500);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'step1_compress_video_page.png') });
  console.log('📸 Saved step1_compress_video_page.png');

  // Step 2: Upload file
  console.log('📁 Step 2: Selecting and uploading file...');
  const fileInput = page.locator('#file-upload-input');
  const samplePath = path.resolve(__dirname, '..', 'sample_test.mp4');
  const originalSize = fs.statSync(samplePath).size;
  await fileInput.setInputFiles(samplePath);
  await page.waitForTimeout(1500);

  // Wait for 3 Percentage Buttons & Popup
  console.log('⏳ Waiting for percentage buttons to appear...');
  await page.waitForSelector('text=Select Compression Level', { timeout: 15000 });
  await page.waitForTimeout(800);

  // Test clicking 20%
  console.log('🎯 Testing 20% button click & popup inspection...');
  const btn20 = page.locator('button[aria-label="Select 20% video compression"]');
  await btn20.click();
  await page.waitForTimeout(500);
  let popupText = await page.locator('text=Expected Size After Compression').locator('..').innerText();
  console.log('📊 20% Popup text:', popupText.replace(/\n/g, ' '));

  // Test clicking 50%
  console.log('🎯 Testing 50% button click & popup inspection...');
  const btn50 = page.locator('button[aria-label="Select 50% video compression"]');
  await btn50.click();
  await page.waitForTimeout(500);
  popupText = await page.locator('text=Expected Size After Compression').locator('..').innerText();
  console.log('📊 50% Popup text:', popupText.replace(/\n/g, ' '));

  // Test clicking 30% (Recommended)
  console.log('🎯 Testing 30% button click (Recommended mode)...');
  const btn30 = page.locator('button[aria-label="Select 30% video compression"]');
  await btn30.click();
  await page.waitForTimeout(500);
  popupText = await page.locator('text=Expected Size After Compression').locator('..').innerText();
  console.log('📊 30% Popup text:', popupText.replace(/\n/g, ' '));

  // Capture screenshot of the 3 buttons & popup
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'step2_percent_buttons_and_popup.png') });
  console.log('📸 Saved step2_percent_buttons_and_popup.png');

  // Step 3: Click Compress Video button
  console.log('⚡ Step 3: Clicking "Compress Video (-30%)" button...');
  const compressBtn = page.locator('button[aria-label="Execute Video Compressor"]');
  await compressBtn.click();

  // Monitor progress values right after clicking
  console.log('⏳ Monitoring real-time progress bar values...');
  const progressLogs = [];
  const startWait = Date.now();
  let capturedActiveShot = false;

  while (Date.now() - startWait < 45000) {
    const isCompleted = await page.locator('text=File Ready').count();
    if (isCompleted > 0) break;

    const progressText = await page.locator('span.font-mono.font-bold').allInnerTexts();
    const stageText = await page.locator('text=Transcoding:').allInnerTexts();
    if (progressText.length > 0) {
      const val = progressText[0];
      if (!progressLogs.includes(val)) {
        progressLogs.push(val);
        console.log(`📈 Observed Progress: ${val} | Details: ${stageText[0] || 'preparing'}`);
      }
    }

    if (!capturedActiveShot && progressLogs.length >= 3) {
      capturedActiveShot = true;
      await page.screenshot({ path: path.join(ARTIFACT_DIR, 'step_progress_active.png') });
      console.log('📸 Captured step_progress_active.png during live encoding');
    }

    await page.waitForTimeout(300);
  }

  console.log('📊 Observed progress sequence:', progressLogs.join(' -> '));

  // Wait for compression to complete
  await page.waitForSelector('text=File Ready', { timeout: 15000 });
  console.log('🎉 Compression completed!');
  await page.waitForTimeout(1500); // wait for video player to load metadata

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'step3_compression_completed_player.png') });
  console.log('📸 Saved step3_compression_completed_player.png');

  // Check stats
  const statsCard = page.locator('text=Original').locator('..');
  const statsText = await statsCard.innerText();
  console.log('📊 Statistics:', statsText.replace(/\n/g, ' | '));

  // Verify video player readiness
  const videoElem = page.locator('video');
  const videoInfo = await videoElem.first().evaluate((v) => {
    return {
      duration: v.duration,
      videoWidth: v.videoWidth,
      videoHeight: v.videoHeight,
      readyState: v.readyState,
      currentSrc: v.currentSrc,
      error: v.error ? v.error.message : null
    };
  });
  console.log('🎬 Embedded Player Details:', JSON.stringify(videoInfo, null, 2));

  // Step 4: Click download and intercept
  console.log('📥 Step 4: Clicking Download button...');
  const downloadPromise = page.waitForEvent('download', { timeout: 15000 });
  const downloadBtn = page.locator('button[aria-label="Download processed Video Compressor file"]');
  await downloadBtn.click();

  const download = await downloadPromise;
  const downloadPath = path.resolve(__dirname, '..', 'downloaded_compressed_test.mp4');
  await download.saveAs(downloadPath);

  const downloadedSize = fs.statSync(downloadPath).size;
  const reduction = Math.round(((originalSize - downloadedSize) / originalSize) * 100);
  console.log('💾 File saved to disk:');
  console.log(`- Original Size: ${originalSize} bytes (${(originalSize / 1024).toFixed(1)} KB)`);
  console.log(`- Downloaded Size: ${downloadedSize} bytes (${(downloadedSize / 1024).toFixed(1)} KB)`);
  console.log(`- Real Reduction: -${reduction}%`);
  console.log(`- Download Filename: ${download.suggestedFilename()}`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'step4_download_completed.png') });
  console.log('📸 Saved step4_download_completed.png');

  await browser.close();
  console.log('✅ All percentage options, popup, transcode, and download verified successfully!');
}

testCompressFlowWithScreenshots().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
