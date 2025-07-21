// Generated from CSV - 2025-07-21T20:58:37.446Z
// Type definitions inline to avoid import issues
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

const sampleMemories: MemoryData[] = []

const sampleTextMemories: TextMemory[] = []

export { sampleMemories, sampleTextMemories }
