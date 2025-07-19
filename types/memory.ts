export interface MemoryData {
  id: number
  imageUrl: string
  title: string
  description: string
  contributor: string
}

export interface TextMemory {
  id: number
  text: string
  author: string
  type: 'quote' | 'story' | 'message' | 'poem'
}

export interface SlideshowItem {
  id: string
  imageUrl: string
  text: string
  author: string
  type: 'memory' | 'random'
} 