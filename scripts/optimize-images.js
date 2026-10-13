// scripts/optimize-images.js
const sharp = require('sharp');
const fs = require('fs');

const images = [
  'public/images/banner.jpg',
  'public/images/og-image.jpg',
  'public/images/background.jpg'
];

images.forEach(async (img) => {
  const webp = img.replace('.jpg', '.webp');
  await sharp(img)
    .resize(1920, 1080, { fit: 'inside' })
    .webp({ quality: 80 })
    .toFile(webp);
  console.log(`✅ Optimized: ${webp}`);
});