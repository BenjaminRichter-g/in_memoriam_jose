import { MemoryData, TextMemory } from '@/types/memory'

interface CSVRow {
  name: string
  image: string
  text: string
  type?: 'quote' | 'story' | 'message' | 'poem'
}

export function transformCSVToMemories(csvData: CSVRow[]) {
  const memories: MemoryData[] = []
  const textMemories: TextMemory[] = []
  
  csvData.forEach((row, index) => {
    const id = index + 1
    
    // If both image and text exist, create a memory entry
    if (row.image && row.text) {
      memories.push({
        id,
        imageUrl: row.image.startsWith('/') ? row.image : `/images/${row.image}`,
        title: row.name || `Memory ${id}`,
        description: row.text,
        contributor: row.name || 'Anonymous'
      })
    }
    // If only image exists, create a memory entry with default text
    else if (row.image && !row.text) {
      memories.push({
        id,
        imageUrl: row.image.startsWith('/') ? row.image : `/images/${row.image}`,
        title: row.name || `Memory ${id}`,
        description: 'A cherished memory shared by family and friends.',
        contributor: row.name || 'Anonymous'
      })
    }
    // If only text exists, create a text memory entry
    else if (row.text && !row.image) {
      textMemories.push({
        id,
        text: row.text,
        author: row.name || 'Anonymous',
        type: row.type || 'message'
      })
    }
  })
  
  return { memories, textMemories }
}

// Example usage:
// const csvData = [
//   { name: "Maria", image: "jose-family.jpg", text: "Beautiful family moment" },
//   { name: "Carlos", image: "jose-birthday.jpg", text: "" },
//   { name: "Ana", image: "", text: "Jose was the kindest person I ever met", type: "quote" }
// ]
// const { memories, textMemories } = transformCSVToMemories(csvData) 