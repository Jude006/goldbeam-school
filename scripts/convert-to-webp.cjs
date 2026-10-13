// scripts/convert-to-webp.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imageDir = './public/images';
const outputDir = './public/images';

const images = [
  'background.jpg',
];

async function convertImages() {
  for (const image of images) {
    const inputPath = path.join(imageDir, image);
    const outputPath = path.join(outputDir, image.replace(/\.(jpg|jpeg|png)$/, '.webp'));
    
    if (!fs.existsSync(inputPath)) {
      console.log(`⚠️ Skipping ${image} - not found`);
      continue;
    }

    try {
      await sharp(inputPath)
        .resize(1920, null, { 
          fit: 'inside',
          withoutEnlargement: true
        })
        .webp({ 
          quality: 80,
          effort: 6 
        })
        .toFile(outputPath);
      
      const stats = fs.statSync(inputPath);
      const newStats = fs.statSync(outputPath);
      const reduction = ((stats.size - newStats.size) / stats.size * 100).toFixed(1);
      
      console.log(`✅ ${image} → ${reduction}% smaller`);
    } catch (error) {
      console.error(`❌ Error converting ${image}:`, error.message);
    }
  }
}

convertImages();