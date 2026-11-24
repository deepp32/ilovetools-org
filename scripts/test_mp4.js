// Test MP4 with moov at the end of the file
function repackMp4(buffer, targetBytes, muteAudio = false) {
  if (buffer.byteLength <= targetBytes) {
    return buffer;
  }

  const view = new DataView(buffer);
  const bytes = new Uint8Array(buffer);
  let offset = 0;
  let ftypBox = null;
  let moovBox = null;
  let mdatBox = null;

  while (offset < buffer.byteLength - 8) {
    let size = view.getUint32(offset);
    if (size === 0) {
      size = buffer.byteLength - offset;
    }
    if (size < 8 || offset + size > buffer.byteLength) break;

    const type = String.fromCharCode(
      bytes[offset + 4],
      bytes[offset + 5],
      bytes[offset + 6],
      bytes[offset + 7]
    );

    if (type === 'ftyp' && !ftypBox) {
      ftypBox = { offset, size };
    } else if (type === 'moov' && !moovBox) {
      moovBox = { offset, size };
    } else if (type === 'mdat' && !mdatBox) {
      mdatBox = { offset, size };
    }

    offset += size;
  }

  if (ftypBox && moovBox && mdatBox) {
    const ftypBytes = bytes.subarray(ftypBox.offset, ftypBox.offset + ftypBox.size);
    // Create a mutable copy of moovBytes in case audio is stripped
    const moovBytes = new Uint8Array(bytes.subarray(moovBox.offset, moovBox.offset + moovBox.size));
    
    if (muteAudio) {
      // Strip audio track if requested
      for (let i = 0; i < moovBytes.length - 16; i++) {
        if (
          moovBytes[i] === 0x68 &&
          moovBytes[i + 1] === 0x64 &&
          moovBytes[i + 2] === 0x6c &&
          moovBytes[i + 3] === 0x72
        ) {
          const hType = String.fromCharCode(
            moovBytes[i + 12],
            moovBytes[i + 13],
            moovBytes[i + 14],
            moovBytes[i + 15]
          );
          if (hType === 'soun') {
            // Find parent trak box and mark as free
            for (let j = Math.max(0, i - 128); j < i; j++) {
              if (
                moovBytes[j] === 0x74 &&
                moovBytes[j + 1] === 0x72 &&
                moovBytes[j + 2] === 0x61 &&
                moovBytes[j + 3] === 0x6b
              ) {
                moovBytes[j] = 0x66;
                moovBytes[j + 1] = 0x72;
                moovBytes[j + 2] = 0x65;
                moovBytes[j + 3] = 0x65;
                break;
              }
            }
          }
        }
      }
    }

    const headerSize = ftypBytes.length + moovBytes.length;

    if (headerSize + 16 < targetBytes) {
      const remainingBytesForMdat = targetBytes - headerSize;
      const newMdat = new Uint8Array(remainingBytesForMdat);
      const mdatView = new DataView(newMdat.buffer);
      
      mdatView.setUint32(0, remainingBytesForMdat);
      newMdat[4] = 0x6d; // m
      newMdat[5] = 0x64; // d
      newMdat[6] = 0x61; // a
      newMdat[7] = 0x74; // t

      const payloadAvailable = Math.min(
        mdatBox.size - 8,
        buffer.byteLength - (mdatBox.offset + 8)
      );
      const copyLen = Math.min(remainingBytesForMdat - 8, payloadAvailable);
      if (copyLen > 0) {
        newMdat.set(bytes.subarray(mdatBox.offset + 8, mdatBox.offset + 8 + copyLen), 8);
      }

      const out = new Uint8Array(targetBytes);
      out.set(ftypBytes, 0);
      out.set(moovBytes, ftypBytes.length);
      out.set(newMdat, headerSize);
      return out.buffer;
    }
  }

  return buffer.slice(0, targetBytes);
}

// Create 150MB buffer with ftyp at start, mdat in middle, moov at END
const buffer150 = new Uint8Array(150 * 1024 * 1024);
// ftyp (size 24)
buffer150[0] = 0; buffer150[1] = 0; buffer150[2] = 0; buffer150[3] = 24;
buffer150[4] = 0x66; buffer150[5] = 0x74; buffer150[6] = 0x79; buffer150[7] = 0x70;

// mdat from 24 to 150MB - 8192
const moovLen = 8192;
const mdatStart = 24;
const mdatLength = buffer150.length - mdatStart - moovLen;
buffer150[mdatStart] = (mdatLength >> 24) & 0xff;
buffer150[mdatStart + 1] = (mdatLength >> 16) & 0xff;
buffer150[mdatStart + 2] = (mdatLength >> 8) & 0xff;
buffer150[mdatStart + 3] = mdatLength & 0xff;
buffer150[mdatStart + 4] = 0x6d; buffer150[mdatStart + 5] = 0x64; buffer150[mdatStart + 6] = 0x61; buffer150[mdatStart + 7] = 0x74;

// moov at end
const moovStart = mdatStart + mdatLength;
buffer150[moovStart] = (moovLen >> 24) & 0xff;
buffer150[moovStart + 1] = (moovLen >> 16) & 0xff;
buffer150[moovStart + 2] = (moovLen >> 8) & 0xff;
buffer150[moovStart + 3] = moovLen & 0xff;
buffer150[moovStart + 4] = 0x6d; buffer150[moovStart + 5] = 0x6f; buffer150[moovStart + 6] = 0x6f; buffer150[moovStart + 7] = 0x76;

console.log('Testing repack with moov at end:');
const out10 = repackMp4(buffer150.buffer, 10 * 1024 * 1024, true);
console.log('Output 10MB byteLength:', out10.byteLength, 'MB:', (out10.byteLength / (1024 * 1024)).toFixed(2));
const out15 = repackMp4(buffer150.buffer, 15 * 1024 * 1024, false);
console.log('Output 15MB byteLength:', out15.byteLength, 'MB:', (out15.byteLength / (1024 * 1024)).toFixed(2));
