'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { MemoryData } from '@/types/memory'

interface ImageGridProps {
  memories: MemoryData[]
  expandedImageId: number | null
  onImageClick: (id: number | null) => void
  onRandomSlideshow: () => void
}

export default function ImageGrid({ memories, expandedImageId, onImageClick, onRandomSlideshow }: ImageGridProps) {
  const [hoveredId, setHoveredId] = useState<number | null>(null)



  return (
    <section id="memories" className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-serif font-bold text-memorial-900 mb-4">
            Cherished Memories
          </h2>
          <p className="text-xl text-memorial-600 max-w-2xl mx-auto mb-8">
            A collection of precious moments shared by family and friends
          </p>
          
          {/* Random Slideshow Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRandomSlideshow}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium rounded-full 
                     hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Random Slideshow
          </motion.button>
        </motion.div>

        {/* Image Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 lg:gap-4">
          <AnimatePresence>
            {memories.map((memory, index) => {
              const isExpanded = expandedImageId === memory.id
              const isHovered = hoveredId === memory.id
              
              return (
                <motion.div
                  key={memory.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                                      animate={{ 
                      opacity: 1, 
                      scale: 1
                    }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ 
                    duration: 0.3,
                    delay: index * 0.05,
                    layout: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
                  }}
                  className={`relative group cursor-pointer ${
                    isExpanded ? 'col-span-2 row-span-2 md:col-span-3 md:row-span-2 lg:col-span-4 lg:row-span-2' : ''
                  }`}
                  onMouseEnter={() => setHoveredId(memory.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => onImageClick(isExpanded ? null : memory.id)}
                >
                  {/* Image Container */}
                  <div className={`relative overflow-hidden rounded-lg shadow-md ${
                    isExpanded ? 'h-[400px] lg:h-[500px]' : 'h-[120px] md:h-[150px] lg:h-[180px]'
                  }`}>
                    <Image
                      src={memory.imageUrl}
                      alt={memory.title}
                      fill
                                           className={`object-cover transition-all duration-300 ease-out ${
                       isHovered && !isExpanded ? 'scale-105' : 'scale-100'
                     }`}
                    />
                    
                    {/* Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent 
                                    transition-opacity duration-300 ${
                                      isExpanded ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                    }`}>
                    </div>

                                         {/* Content */}
                     <div className={`absolute bottom-0 left-0 right-0 text-white transform transition-all duration-300 ${
                       isExpanded ? 'translate-y-0 p-4 md:p-6' : 'translate-y-2 p-2 group-hover:translate-y-0'
                     }`}>
                       <h3 className={`font-serif font-bold mb-1 ${
                         isExpanded ? 'text-xl md:text-2xl' : 'text-xs md:text-sm'
                       }`}>
                        {memory.title}
                      </h3>
                      
                                             {isExpanded && (
                         <motion.div
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ delay: 0.1, duration: 0.4 }}
                           className="space-y-2 md:space-y-3 max-h-32 md:max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
                         >
                           <p className="text-memorial-100 leading-relaxed text-sm md:text-base pr-2">
                             {memory.description}
                           </p>
                           <div className="flex items-center justify-between text-xs md:text-sm text-memorial-200 pt-2 border-t border-white/10">
                             <span>Shared by {memory.contributor}</span>
                           </div>
                         </motion.div>
                       )}
                      
                                             {!isExpanded && (
                         <div className="flex items-center justify-between text-xs text-memorial-200">
                           <span className="truncate">{memory.contributor}</span>
                         </div>
                       )}
                    </div>

                                         {/* Expand/Collapse Indicator */}
                     <div className={`absolute top-2 right-2 md:top-4 md:right-4 w-6 h-6 md:w-8 md:h-8 bg-white/20 backdrop-blur-sm rounded-full 
                                     flex items-center justify-center transition-all duration-300 ${
                                       isExpanded ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                     }`}>
                                             <svg 
                         className={`w-3 h-3 md:w-4 md:h-4 text-white transition-transform duration-300 ${
                           isExpanded ? 'rotate-45' : 'rotate-0'
                         }`} 
                         fill="none" 
                         stroke="currentColor" 
                         viewBox="0 0 24 24"
                       >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-lg text-memorial-600 mb-6">
            Click on any image to expand and read the full story behind each memory. Hover to preview.
          </p>
        </motion.div>
      </div>
    </section>
  )
} 