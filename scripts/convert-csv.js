const fs = require('fs')
const path = require('path')
const { parse } = require('csv-parse/sync')

// CSV Parser function
function parseCSV(csvContent) {
  // Use csv-parse/sync for robust parsing
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  })
  return records.map(row => ({
    name: row.name || '',
    image: row.image || '',
    text: row.text || '',
    date: row.date || undefined,
    type: row.type || undefined
  }))
}

// Helper to convert Google Drive links to direct image links
function toDirectGoogleDriveUrl(url) {
  if (!url) return '';
  // Match open?id= or file/d/ links
  let match = url.match(/open\?id=([\w-]+)/);
  if (match) {
    return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }
  match = url.match(/file\/d\/([\w-]+)/);
  if (match) {
    return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }
  // Already in uc?export=view format or not a Drive link
  return url;
}

// Transform CSV data to memories
function transformCSVToMemories(csvData) {
  const memories = []
  const textMemories = []
  // Track which names have already had their text used
  const usedTextForName = {}
  let memoryId = 1
  let textId = 1
  csvData.forEach((row) => {
    const nameKey = row.name || 'Anonymous'
    // If row has an image
    if (row.image) {
      const imageUrl = toDirectGoogleDriveUrl(row.image)
      if (!usedTextForName[nameKey]) {
        memories.push({
          id: memoryId++,
          imageUrl,
          title: row.name || `Memory ${memoryId}`,
          description: row.text || '',
          contributor: row.name || 'Anonymous'
        })
        usedTextForName[nameKey] = true
      } else {
        memories.push({
          id: memoryId++,
          imageUrl,
          title: row.name || `Memory ${memoryId}`,
          description: '',
          contributor: row.name || 'Anonymous'
        })
      }
    } else if (row.text) {
      // If row is text-only (no image), add to textMemories
      textMemories.push({
        id: textId++,
        text: row.text,
        author: row.name || 'Anonymous',
        type: 'message' // Default type, can be improved if needed
      })
    }
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
    // Use JSON.stringify to ensure all strings are escaped properly
    const tsCode = `${tsTypeDefs}
// Generated from CSV - ${new Date().toISOString()}
const sampleMemories: MemoryData[] = ${JSON.stringify(memories, null, 2)}

const sampleTextMemories: TextMemory[] = ${JSON.stringify(textMemories, null, 2)}

export { sampleMemories, sampleTextMemories }
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