const fs = require('fs');
const path = require('path');

async function downloadSample() {
  const url = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
  console.log('Downloading larger sample video from', url);
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  const filePath = path.join(__dirname, '..', 'large_sample.mp4');
  fs.writeFileSync(filePath, Buffer.from(buffer));
  console.log('Downloaded large_sample.mp4, size:', buffer.byteLength, 'bytes');

  const uploadDir = 'C:\\Users\\Test\\.gemini\antigravity\\brain\\a443697c-e3aa-4472-bc24-8c9cfc13ca4e\\browser_sandbox\\uploads';
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  const uploadPath = path.join(uploadDir, 'large_sample.mp4');
  fs.writeFileSync(uploadPath, Buffer.from(buffer));
  console.log('Staged to browser_sandbox/uploads/large_sample.mp4');
}

downloadSample().catch(console.error);
