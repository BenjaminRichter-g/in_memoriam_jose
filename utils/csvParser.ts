interface CSVRow {
  name: string
  image: string
  text: string
  date?: string
  type?: 'quote' | 'story' | 'message' | 'poem'
}

export function parseCSV(csvContent: string): CSVRow[] {
  const lines = csvContent.trim().split('\n')
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
  
  const rows: CSVRow[] = []
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    if (!line.trim()) continue
    
    // Handle commas within quoted fields
    const values: string[] = []
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
    
    const row: CSVRow = {
      name: cleanValues[headers.indexOf('name')] || '',
      image: cleanValues[headers.indexOf('image')] || '',
      text: cleanValues[headers.indexOf('text')] || '',
      date: cleanValues[headers.indexOf('date')] || undefined,
      type: (cleanValues[headers.indexOf('type')] as 'quote' | 'story' | 'message' | 'poem') || undefined
    }
    
    rows.push(row)
  }
  
  return rows
}

// Example CSV format:
/*
name,image,text,date,type
Maria,jose-family.jpg,"Beautiful family moment with Jose",2023-12-25,
Carlos,jose-birthday.jpg,,2023-05-20,
Ana,,Jose was the kindest person I ever met,2023-12-15,quote
*/ 