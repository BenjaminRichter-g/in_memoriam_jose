'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { MemoryData, TextMemory, SlideshowItem } from '@/types/memory'

interface RandomSlideshowProps {
  memories: MemoryData[]
  textMemories: TextMemory[]
  isOpen: boolean
  onClose: () => void
}

export default function RandomSlideshow({ memories, textMemories, isOpen, onClose }: RandomSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [slideshowItems, setSlideshowItems] = useState<SlideshowItem[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [autoPlayInterval, setAutoPlayInterval] = useState<NodeJS.Timeout | null>(null)

  // Generate random slideshow items
  const generateSlideshowItems = useCallback(() => {
    const items: SlideshowItem[] = []
    
    // Add all memories
    memories.forEach(memory => {
      items.push({
        id: `memory-${memory.id}`,
        imageUrl: memory.imageUrl,
        text: memory.description,
        author: memory.contributor,
        type: 'memory'
      })
    })

    // Add random text memories with random images
    textMemories.forEach(textMemory => {
      const randomMemory = memories[Math.floor(Math.random() * memories.length)]
      items.push({
        id: `text-${textMemory.id}`,
        imageUrl: randomMemory.imageUrl,
        text: textMemory.text,
        author: textMemory.author,
        type: 'random'
      })
    })

    // Shuffle the array
    const shuffled = items.sort(() => Math.random() - 0.5)
    setSlideshowItems(shuffled)
    setCurrentIndex(0)
  }, [memories, textMemories])

  // Initialize slideshow when opened
  useEffect(() => {
    if (isOpen && slideshowItems.length === 0) {
      generateSlideshowItems()
    }
  }, [isOpen, slideshowItems.length, generateSlideshowItems])

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && isOpen) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % slideshowItems.length)
      }, 6000)
      setAutoPlayInterval(interval)
      return () => clearInterval(interval)
    } else if (autoPlayInterval) {
      clearInterval(autoPlayInterval)
      setAutoPlayInterval(null)
    }
  }, [isPlaying, isOpen, slideshowItems.length])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return
      
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault()
          goToPrevious()
          break
        case 'ArrowRight':
          event.preventDefault()
          goToNext()
          break
        case ' ':
          event.preventDefault()
          togglePlayPause()
          break
        case 'Escape':
          event.preventDefault()
          onClose()
          break
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, slideshowItems.length])

  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % slideshowItems.length)
  }

  const goToPrevious = () => {
    setCurrentIndex(prev => (prev - 1 + slideshowItems.length) % slideshowItems.length)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }



  if (!isOpen) return null

  const currentItem = slideshowItems[currentIndex]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative max-w-4xl w-full max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/60 to-transparent p-6">
          <div className="flex items-center justify-between text-white">
            <div>
              <h2 className="text-2xl font-serif font-bold">Random Memories</h2>
              <p className="text-sm opacity-80">
                {currentIndex + 1} of {slideshowItems.length}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative h-[60vh] md:h-[70vh]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentItem?.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className="relative w-full h-full"
            >
              {currentItem && (
                <>
                  {/* Image */}
                  <div className="relative w-full h-full">
                    <Image
                      src={currentItem.imageUrl}
                      alt="Memory"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  </div>

                  {/* Text Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white pb-24 md:pb-28">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className="max-w-3xl"
                    >
                      <div className="mb-3 md:mb-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          currentItem.type === 'memory' 
                            ? 'bg-primary-500/80' 
                            : 'bg-memorial-500/80'
                        }`}>
                          {currentItem.type === 'memory' ? 'Memory' : 'Random'}
                        </span>
                      </div>
                      
                      <div className="max-h-32 md:max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent pr-2">
                        <p className="text-base md:text-lg lg:text-xl leading-relaxed mb-3 md:mb-4 font-serif">
                          "{currentItem.text}"
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm opacity-80 pt-2 border-t border-white/20">
                        <span>— {currentItem.author}</span>
                      </div>
                    </motion.div>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 md:p-6">
          <div className="flex items-center justify-center space-x-4">
            {/* Previous Button */}
            <button
              onClick={goToPrevious}
              className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Play/Pause Button */}
            <button
              onClick={togglePlayPause}
              className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors shadow-lg"
            >
              {isPlaying ? (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                </svg>
              ) : (
                <svg className="w-8 h-8 text-white ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l14 9-14 9V3z" />
                </svg>
              )}
            </button>

            {/* Next Button */}
            <button
              onClick={goToNext}
              className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-white/20 rounded-full h-1">
              <motion.div
                className="bg-primary-500 h-1 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentIndex + 1) / slideshowItems.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>

        {/* Keyboard Navigation */}
        <div className="absolute top-4 right-4 text-white/60 text-xs">
          <p>Use ← → keys to navigate</p>
        </div>
      </motion.div>
    </motion.div>
  )
} 