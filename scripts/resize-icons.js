// scripts/resize-icons-fixed.js
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ USE YOUR ORIGINAL LOGO as source
const source = path.join(__dirname, '..', 'public', 'images', 'final_crest.png');
const outputDir = path.join(__dirname, '..', 'public', 'images');

const sizes = [
  { width: 144, height: 144, name: 'icon-144.png' },
  { width: 192, height: 192, name: 'icon-192.png' },
  { width: 512, height: 512, name: 'icon-512.png' },
];

async function resizeIcons() {
  console.log('🔄 Resizing icons from original logo...\n');

  // Check if source exists
  if (!fs.existsSync(source)) {
    console.error(`❌ Source file not found: ${source}`);
    console.log('📌 Available logo files:');
    const files = fs.readdirSync(path.join(__dirname, '..', 'public', 'images'));
    const logos = files.filter(f => f.includes('logo') || f.includes('crest'));
    console.log(logos.map(f => `   - ${f}`).join('\n'));
    return;
  }

  console.log(`📁 Using source: ${path.basename(source)}`);

  for (const size of sizes) {
    const outputPath = path.join(outputDir, size.name);
    
    try {
      await sharp(source)
        .resize(size.width, size.height, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .png()
        .toFile(outputPath);
      
      const stats = fs.statSync(outputPath);
      console.log(`✅ ${size.name} (${size.width}x${size.height}) → ${(stats.size / 1024).toFixed(1)} KB`);
    } catch (error) {
      console.error(`❌ Error creating ${size.name}:`, error.message);
    }
  }
  
  console.log('\n🎉 All icons resized!');
}

resizeIcons();