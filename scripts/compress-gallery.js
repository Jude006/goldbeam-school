// scripts/compress-gallery.js
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const galleryDir = path.join(__dirname, '..', 'public', 'images', 'gallery');

// Create WebP versions of all gallery images
const images = fs.readdirSync(galleryDir).filter(f => 
  f.match(/\.(jpg|jpeg|png)$/i)
);

console.log(`🔄 Converting ${images.length} images to WebP...\n`);

for (const image of images) {
  const inputPath = path.join(galleryDir, image);
  const outputPath = inputPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  
  try {
    const stats = fs.statSync(inputPath);
    await sharp(inputPath)
      .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 75 })
      .toFile(outputPath);
    
    const newStats = fs.statSync(outputPath);
    const reduction = ((stats.size - newStats.size) / stats.size * 100).toFixed(1);
    console.log(`✅ ${image} → ${reduction}% smaller (${(newStats.size / 1024).toFixed(0)} KB)`);
  } catch (error) {
    console.error(`❌ Error: ${image}`, error.message);
  }
}

console.log('\n🎉 Images compressed!');