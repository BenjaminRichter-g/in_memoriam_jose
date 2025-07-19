#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

// Simple CSV parser that handles quoted fields properly
function parseCSV(content) {
  const lines = content.split('\n').filter(line => line.trim())
  if (lines.length === 0) return []
  
  const headers = lines[0].split(',').map(h => h.trim())
  const rows = []
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    const values = []
    let current = ''
    let inQuotes = false
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j]
      
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    values.push(current.trim()) // Add the last value
    
    if (values.length >= headers.length) {
      const row = {}
      headers.forEach((header, index) => {
        row[header] = values[index] || ''
      })
      rows.push(row)
    }
  }
  
  return rows
}

// Transform CSV data to memories
function transformCSVToMemories(csvData) {
  const memories = []
  const textMemories = []
  const imageOnlyRows = []
  const textOnlyRows = []
  
  // First pass: categorize all rows
  csvData.forEach((row, index) => {
    const id = index + 1
    
    // If both image and text exist, create a memory entry
    if (row.image && row.text) {
      // Convert Google Drive URL to direct image URL if needed
      let imageUrl = row.image
      if (imageUrl.includes('drive.google.com')) {
        // Convert Google Drive sharing URL to direct image URL
        if (imageUrl.includes('/open?id=')) {
          const fileId = imageUrl.match(/\/open\?id=([a-zA-Z0-9_-]+)/)?.[1]
          if (fileId) {
            imageUrl = `https://drive.google.com/uc?export=view&id=${fileId}`
          }
        }
      }
      
      memories.push({
        id,
        imageUrl: imageUrl,
        title: row.name || `Memory ${id}`,
        description: row.text,
        date: row.date || new Date().toISOString().split('T')[0],
        contributor: row.name || 'Anonymous'
      })
    }
    // If only image exists, store for later pairing
    else if (row.image && !row.text) {
      imageOnlyRows.push({
        id,
        image: row.image,
        name: row.name,
        date: row.date
      })
    }
    // If only text exists, store for later pairing and slideshow
    else if (row.text && !row.image) {
      textOnlyRows.push({
        id,
        text: row.text,
        name: row.name,
        date: row.date,
        type: row.type
      })
      
      // Also add to text memories for slideshow
      textMemories.push({
        id,
        text: row.text,
        author: row.name || 'Anonymous',
        date: row.date || new Date().toISOString().split('T')[0],
        type: row.type || 'message'
      })
    }
  })
  
  // Second pass: pair remaining images with random text
  imageOnlyRows.forEach((imageRow, index) => {
    const memoryId = memories.length + index + 1
    
    // Get a random text entry to pair with this image
    const randomTextRow = textOnlyRows[Math.floor(Math.random() * textOnlyRows.length)]
    
    // Convert Google Drive URL to direct image URL if needed
    let imageUrl = imageRow.image
    if (imageUrl.includes('drive.google.com')) {
      if (imageUrl.includes('/open?id=')) {
        const fileId = imageUrl.match(/\/open\?id=([a-zA-Z0-9_-]+)/)?.[1]
        if (fileId) {
          imageUrl = `https://drive.google.com/uc?export=view&id=${fileId}`
        }
      }
    }
    
    memories.push({
      id: memoryId,
      imageUrl: imageUrl,
      title: imageRow.name || randomTextRow.name || `Memory ${memoryId}`,
      description: randomTextRow.text || 'A cherished memory shared by family and friends.',
      date: imageRow.date || randomTextRow.date || new Date().toISOString().split('T')[0],
      contributor: imageRow.name || randomTextRow.name || 'Anonymous'
    })
  })
  
  return { memories, textMemories }
}

function main() {
  const args = process.argv.slice(2)
  
  if (args.length !== 1) {
    console.log('Usage: node convert-csv-simple.js <csv-file>')
    process.exit(1)
  }
  
  const csvFile = args[0]
  
  if (!fs.existsSync(csvFile)) {
    console.error(`❌ Error: File '${csvFile}' not found!`)
    process.exit(1)
  }
  
  try {
    console.log(`📖 Reading CSV file: ${csvFile}`)
    const content = fs.readFileSync(csvFile, 'utf8')
    
    const csvData = parseCSV(content)
    console.log(`📊 Found ${csvData.length} rows in CSV`)
    
    const { memories, textMemories } = transformCSVToMemories(csvData)
    
    console.log(`🖼️  Created ${memories.length} memory entries`)
    console.log(`📝 Created ${textMemories.length} text memory entries`)
    
    // Write JSON output
    const jsonOutput = {
      memories,
      textMemories
    }
    
    const jsonFile = csvFile.replace('.csv', '.json')
    fs.writeFileSync(jsonFile, JSON.stringify(jsonOutput, null, 2))
    console.log(`✅ Successfully converted to: ${jsonFile}`)
    
    // Generate TypeScript code
    const tsContent = `// Generated from CSV - ${new Date().toISOString()}
const sampleMemories: MemoryData[] = ${JSON.stringify(memories, null, 2)}

const sampleTextMemories: TextMemory[] = ${JSON.stringify(textMemories, null, 2)}

export { sampleMemories, sampleTextMemories }
`
    
    const tsFile = csvFile.replace('.csv', '.ts')
    fs.writeFileSync(tsFile, tsContent)
    console.log(`📝 TypeScript code generated: ${tsFile}`)
    
  } catch (error) {
    console.error(`❌ Error: ${error.message}`)
    process.exit(1)
  }
}

main() 