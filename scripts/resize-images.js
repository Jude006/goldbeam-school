// scripts/resize-images.js

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Check if logo exists
const logoPath = path.join(__dirname, '..', 'public', 'images', 'logo.png');

if (!fs.existsSync(logoPath)) {
  console.error('❌ Error: logo.png not found at public/images/logo.png');
  console.log('📌 Please place your school logo at: public/images/logo.png');
  process.exit(1);
}

// Define sizes to generate
const sizes = [
  { width: 144, height: 144, name: 'icon-144.png' },
  { width: 192, height: 192, name: 'icon-192.png' },
  { width: 512, height: 512, name: 'icon-512.png' },
];

console.log('🔄 Resizing images...');

async function resizeImages() {
  const source = path.join(__dirname, '..', 'public', 'images', 'logo.png');
  
  for (const size of sizes) {
    const outputPath = path.join(__dirname, '..', 'public', 'images', size.name);
    
    try {
      await sharp(source)
        .resize(size.width, size.height, { 
          fit: 'contain', 
          background: { r: 255, g: 255, b: 255, alpha: 1 } 
        })
        .png()
        .toFile(outputPath);
      
      console.log(`✅ Created ${size.name} (${size.width}x${size.height})`);
    } catch (error) {
      console.error(`❌ Error creating ${size.name}:`, error.message);
    }
  }
  
  console.log('🎉 All images resized successfully!');
  console.log('📁 Check public/images/ for the new icons.');
}

// Run the script
resizeImages();