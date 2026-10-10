const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Create a valid 180x180 uncompressed PNG file using pure Node.js
function createPng(width, height, drawPixel) {
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // bit depth 8
  ihdrData.writeUInt8(6, 9); // RGBA
  ihdrData.writeUInt8(0, 10); // compression
  ihdrData.writeUInt8(0, 11); // filter
  ihdrData.writeUInt8(0, 12); // interlace

  const ihdrChunk = createChunk('IHDR', ihdrData);

  // Raw image data with filter byte 0 at start of each scanline
  const scanlineLength = 1 + width * 4;
  const rawData = Buffer.alloc(height * scanlineLength);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * scanlineLength;
    rawData.writeUInt8(0, rowOffset); // filter type none
    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;
      const [r, g, b, a] = drawPixel(x, y, width, height);
      rawData.writeUInt8(r, pixelOffset);
      rawData.writeUInt8(g, pixelOffset + 1);
      rawData.writeUInt8(b, pixelOffset + 2);
      rawData.writeUInt8(a, pixelOffset + 3);
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', compressedData);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function crc32(buf) {
  let table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ (-1)) >>> 0;
}

function createChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);

  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  const checkBuf = Buffer.concat([typeBuf, data]);
  crcBuf.writeUInt32BE(crc32(checkBuf), 0);

  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

// Generate an elegant, original mark for FiberLab:
// Blue rounded tile (#0369a1), white fiber cladding ring, red central laser core
function fiberLabIconPixel(x, y, w, h) {
  const cx = w / 2;
  const cy = h / 2;
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Background rounded square
  const cornerR = w * 0.18;
  const innerX = Math.max(Math.abs(dx) - (w / 2 - cornerR), 0);
  const innerY = Math.max(Math.abs(dy) - (h / 2 - cornerR), 0);
  const cornerDist = Math.sqrt(innerX * innerX + innerY * innerY);

  if (cornerDist > cornerR) {
    return [0, 0, 0, 0]; // transparent
  }

  // Central red beam core (r <= 0.16 * w)
  if (dist <= w * 0.16) {
    return [220, 38, 38, 255]; // #dc2626 laser red
  }

  // Fiber core zone (0.16 * w < dist <= 0.28 * w)
  if (dist <= w * 0.28) {
    return [15, 23, 42, 255]; // #0f172a slate
  }

  // Cladding ring (0.34 * w <= dist <= 0.40 * w)
  if (dist >= w * 0.34 && dist <= w * 0.40) {
    return [255, 255, 255, 230]; // white ring
  }

  // Horizontal guide line
  if (Math.abs(dy) <= w * 0.03 && dist >= w * 0.16 && dist <= w * 0.44) {
    return [220, 38, 38, 255]; // red laser ray
  }

  // Solid background #0369a1
  return [3, 105, 161, 255];
}

// Convert PNG to simple 1-image ICO
function createIcoFromPng(pngBuffer) {
  const icoHeader = Buffer.alloc(6);
  icoHeader.writeUInt16LE(0, 0); // reserved
  icoHeader.writeUInt16LE(1, 2); // icon type (1 = icon)
  icoHeader.writeUInt16LE(1, 4); // count of images (1)

  const dirEntry = Buffer.alloc(16);
  dirEntry.writeUInt8(48, 0); // width 48 (or 0 for 256)
  dirEntry.writeUInt8(48, 1); // height 48
  dirEntry.writeUInt8(0, 2); // color count
  dirEntry.writeUInt8(0, 3); // reserved
  dirEntry.writeUInt16LE(1, 4); // color planes
  dirEntry.writeUInt16LE(32, 6); // bits per pixel
  dirEntry.writeUInt32LE(pngBuffer.length, 8); // size of image data
  dirEntry.writeUInt32LE(22, 12); // offset of image data (6 + 16 = 22)

  return Buffer.concat([icoHeader, dirEntry, pngBuffer]);
}

const clientPublicDir = path.join(__dirname, '..', 'client', 'public');
fs.mkdirSync(clientPublicDir, { recursive: true });

// 180x180 apple touch icon
const png180 = createPng(180, 180, fiberLabIconPixel);
fs.writeFileSync(path.join(clientPublicDir, 'apple-touch-icon.png'), png180);

// 48x48 icon for favicon.ico
const png48 = createPng(48, 48, fiberLabIconPixel);
const ico = createIcoFromPng(png48);
fs.writeFileSync(path.join(clientPublicDir, 'favicon.ico'), ico);

console.log('Generated apple-touch-icon.png (180x180) and favicon.ico successfully.');
