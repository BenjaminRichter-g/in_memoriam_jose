'use client'

import { useState } from 'react'
import HeroSection from '@/components/HeroSection'
import ImageGrid from '@/components/ImageGrid'
import RandomSlideshow from '@/components/RandomSlideshow'
import { MemoryData, TextMemory } from '@/types/memory'

// Import your converted CSV data here
// Generated from Jose's Album CSV - 2025-07-19 (No Date Version)
import { sampleMemories, sampleTextMemories } from '../public/memories-data'

export default function Home() {
  const [expandedImageId, setExpandedImageId] = useState<number | null>(null)
  const [isSlideshowOpen, setIsSlideshowOpen] = useState(false)

  return (
    <main className="min-h-screen">
      <HeroSection />
      <ImageGrid 
        memories={sampleMemories}
        expandedImageId={expandedImageId}
        onImageClick={setExpandedImageId}
        onRandomSlideshow={() => setIsSlideshowOpen(true)}
      />
      <RandomSlideshow
        memories={sampleMemories}
        textMemories={sampleTextMemories}
        isOpen={isSlideshowOpen}
        onClose={() => setIsSlideshowOpen(false)}
      />
    </main>
  )
} 