'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-16">
      <div className="absolute inset-0 bg-gradient-to-b from-memorial-100/50 to-memorial-200/30"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          {/* Main Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="relative w-full h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/jose-main.jpg"
                alt="Jose - In Loving Memory"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary-400 rounded-full opacity-60"></div>
            <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-primary-300 rounded-full opacity-40"></div>
          </motion.div>

          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-serif font-bold text-memorial-900 leading-tight">
                Jose
              </h1>
              <h2 className="text-2xl lg:text-3xl font-light text-memorial-700 font-serif">
                In Loving Memory
              </h2>
              <div className="w-24 h-1 bg-primary-400 rounded-full"></div>
            </div>

            <div className="space-y-4 text-lg text-memorial-700 leading-relaxed">
              <p className="font-serif italic">
                "A life well-lived is a life well-loved. Jose touched the hearts of everyone he met with his warmth, 
                kindness, and infectious smile."
              </p>
              
              <p>
                This memorial website is a collection of cherished memories, photographs, and heartfelt messages 
                from family and friends who were fortunate enough to know and love Jose.
              </p>
              
              <p>
                Through these shared moments, we celebrate his life, honor his memory, and keep his spirit alive 
                in our hearts forever.
              </p>
            </div>

            <div className="pt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-8 py-3 bg-primary-500 text-white font-medium rounded-full 
                         hover:bg-primary-600 transition-colors duration-300 shadow-lg hover:shadow-xl"
                onClick={() => {
                  document.getElementById('memories')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                View Memories
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-memorial-400 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-memorial-400 rounded-full mt-2"
          ></motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
} 