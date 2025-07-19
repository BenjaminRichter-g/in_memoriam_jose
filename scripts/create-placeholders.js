const fs = require('fs')
const path = require('path')

// Create a simple SVG placeholder image
function createSVGPlaceholder(filename, color = '#4B5563', text = 'Memory') {
  const svg = `
<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="300" fill="${color}" opacity="0.8"/>
  <text x="200" y="150" font-family="Arial, sans-serif" font-size="24" fill="white" text-anchor="middle" dominant-baseline="middle">${text}</text>
  <text x="200" y="180" font-family="Arial, sans-serif" font-size="16" fill="white" text-anchor="middle" dominant-baseline="middle">${filename.replace('.jpg', '')}</text>
</svg>`

  const filepath = path.join(__dirname, '..', 'public', 'images', filename)
  fs.writeFileSync(filepath, svg)
  console.log(`✅ Created: ${filename}`)
}

// Create placeholder images
const images = [
  { filename: 'jose-main.jpg', color: '#1F2937', text: 'Jose' },
  { filename: 'jose-family.jpg', color: '#059669', text: 'Family' },
  { filename: 'jose-birthday.jpg', color: '#DC2626', text: 'Birthday' },
  { filename: 'jose-work.jpg', color: '#2563EB', text: 'Work' },
  { filename: 'jose-hiking.jpg', color: '#7C3AED', text: 'Hiking' },
  { filename: 'jose-concert.jpg', color: '#EA580C', text: 'Concert' },
  { filename: 'jose-coffee.jpg', color: '#92400E', text: 'Coffee' }
]

console.log('🎨 Creating placeholder images...')
images.forEach(img => createSVGPlaceholder(img.filename, img.color, img.text))
console.log('✅ All placeholder images created!') 