const fs = require('fs')
const path = require('path')

// CSV Parser function
function parseCSV(csvContent) {
  const lines = csvContent.trim().split('\n')
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
  
  const rows = []
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue
    
    // Handle commas within quoted fields
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
    
    // Remove quotes from values
    const cleanValues = values.map(v => v.replace(/^"|"$/g, ''))
    
    const row = {
      name: cleanValues[headers.indexOf('name')] || '',
      image: cleanValues[headers.indexOf('image')] || '',
      text: cleanValues[headers.indexOf('text')] || '',
      date: cleanValues[headers.indexOf('date')] || undefined,
      type: cleanValues[headers.indexOf('type')] || undefined
    }
    
    // Clean up the data - handle quoted text properly
    if (row.text && row.text.includes(',')) {
      // If text contains commas, it might be split incorrectly
      // Try to reconstruct the full text
      const textIndex = headers.indexOf('text')
      if (textIndex >= 0) {
        // Find the end of the quoted text
        let fullText = ''
        let inQuotes = false
        let quoteStart = -1
        
        for (let i = textIndex; i < values.length; i++) {
          const value = values[i]
          if (value.startsWith('"') && !inQuotes) {
            inQuotes = true
            quoteStart = i
            fullText = value.substring(1) // Remove opening quote
          } else if (inQuotes) {
            if (value.endsWith('"')) {
              // End of quoted text
              fullText += ',' + value.substring(0, value.length - 1)
              break
            } else {
              fullText += ',' + value
            }
          }
        }
        
        if (fullText) {
          row.text = fullText
        }
      }
    }
    
    rows.push(row)
  }
  
  return rows
}

// Transform CSV data to memories
function transformCSVToMemories(csvData) {
  const memories = []
  const textMemories = []
  const imageOnlyRows = []
  const textOnlyRows = []

  // Track which names have already had their text used
  const usedTextForName = {}

  // First pass: categorize all rows
  csvData.forEach((row, index) => {
    const id = index + 1

    // If both image and text exist, only use text for the first image per person
    if (row.image && row.text) {
      // Convert Google Drive URL to direct image URL if needed
      let imageUrl = row.image
      if (imageUrl.includes('drive.google.com')) {
        // Convert Google Drive sharing URL to direct image URL
        if (imageUrl.includes('/file/d/')) {
          const fileId = imageUrl.match(/\/file\/d\/([^\/]+)/)?.[1]
          if (fileId) {
            imageUrl = `https://drive.google.com/uc?export=view&id=${fileId}`
          }
        }
      }
      const nameKey = row.name || 'Anonymous'
      if (!usedTextForName[nameKey]) {
        memories.push({
          id,
          imageUrl: imageUrl,
          title: row.name || `Memory ${id}`,
          description: row.text,
          contributor: row.name || 'Anonymous'
        })
        usedTextForName[nameKey] = true
      } else {
        memories.push({
          id,
          imageUrl: imageUrl,
          title: row.name || `Memory ${id}`,
          description: '',
          contributor: row.name || 'Anonymous'
        })
      }
    }
    // If only image exists, store for later pairing
    else if (row.image && !row.text) {
      imageOnlyRows.push({
        id,
        image: row.image,
        name: row.name
      })
    }
    // If only text exists, store for later pairing and slideshow
    else if (row.text && !row.image) {
      textOnlyRows.push({
        id,
        text: row.text,
        name: row.name,
        type: row.type
      })
      // Also add to text memories for slideshow
      textMemories.push({
        id,
        text: row.text,
        author: row.name || 'Anonymous',
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
      // Convert Google Drive sharing URL to direct image URL
      if (imageUrl.includes('/file/d/')) {
        const fileId = imageUrl.match(/\/file\/d\/([^\/]+)/)?.[1]
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
      contributor: imageRow.name || randomTextRow.name || 'Anonymous'
    })
  })
  
  return { memories, textMemories }
}

// Main conversion function
function convertCSVFile(inputPath, outputPath) {
  try {
    // Read CSV file
    const csvContent = fs.readFileSync(inputPath, 'utf8')
    console.log(`📖 Reading CSV file: ${inputPath}`)
    
    // Parse CSV
    const csvData = parseCSV(csvContent)
    console.log(`📊 Found ${csvData.length} rows in CSV`)
    
    // Transform to memories
    const { memories, textMemories } = transformCSVToMemories(csvData)
    console.log(`🖼️  Created ${memories.length} memory entries`)
    console.log(`📝 Created ${textMemories.length} text memory entries`)
    
    // Create output data
    const outputData = {
      memories,
      textMemories,
      generatedAt: new Date().toISOString(),
      totalEntries: csvData.length
    }
    
    // Write output file
    fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2))
    console.log(`✅ Successfully converted to: ${outputPath}`)
    
    // Generate TypeScript code snippet
    const tsTypeDefs = `// Type definitions inline to avoid import issues
interface MemoryData {
  id: number
  imageUrl: string
  title: string
  description: string
  contributor: string
}

interface TextMemory {
  id: number
  text: string
  author: string
  type: 'quote' | 'story' | 'message' | 'poem'
}
`
    const tsCode = `${tsTypeDefs}
// Generated from CSV - ${new Date().toISOString()}
const sampleMemories: MemoryData[] = ${JSON.stringify(memories, null, 2)}

const sampleTextMemories: TextMemory[] = ${JSON.stringify(textMemories, null, 2)}
`
    
    const tsOutputPath = outputPath.replace('.json', '.ts')
    fs.writeFileSync(tsOutputPath, tsCode)
    console.log(`📝 TypeScript code generated: ${tsOutputPath}`)
    
    return { memories, textMemories }
  } catch (error) {
    console.error('❌ Error converting CSV:', error.message)
    process.exit(1)
  }
}

// Command line usage
if (require.main === module) {
  const args = process.argv.slice(2)
  
  if (args.length < 1) {
    console.log('Usage: node convert-csv.js <input-csv-file> [output-json-file]')
    console.log('')
    console.log('Example:')
    console.log('  node convert-csv.js memories.csv')
    console.log('  node convert-csv.js memories.csv output.json')
    console.log('')
    console.log('CSV Format:')
    console.log('  name,image,text,date,type')
    console.log('  Maria,jose-family.jpg,"Beautiful moment",2023-12-25,')
    console.log('  Carlos,jose-birthday.jpg,,2023-05-20,')
    console.log('  Ana,,Jose was kind,2023-12-15,quote')
    process.exit(1)
  }
  
  const inputFile = args[0]
  const outputFile = args[1] || inputFile.replace('.csv', '.json')
  
  convertCSVFile(inputFile, outputFile)
}

module.exports = { convertCSVFile, parseCSV, transformCSVToMemories } 