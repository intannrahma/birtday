import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence, MotionConfig } from 'framer-motion'
import { OpeningScreen } from './OpeningScreen'
import { ChapterNavigation } from './ChapterNavigation'
import { MusicPlayer } from './MusicPlayer'
import { AdminPanel } from './AdminPanel'
import { MusicProvider } from '../contexts/MusicContext'
import { useContent, useContentStore } from '../store/contentStore'

export const BirthdayExperience: React.FC = () => {
  const content = useContent()
  const [showOpening, setShowOpening] = useState(() => !/^#c=\d+$/.test(window.location.hash))
  const adminOpen = useContentStore((s) => s.adminOpen)
  const toggleAdmin = useContentStore((s) => s.toggleAdmin)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault()
        toggleAdmin()
      }
    }
    const handleHash = () => {
      if (window.location.hash === '#admin') toggleAdmin()
    }
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('hashchange', handleHash)
    if (window.location.hash === '#admin') toggleAdmin()
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('hashchange', handleHash)
    }
  }, [toggleAdmin])

  return (
    <MotionConfig reducedMotion="user">
      <MusicProvider songSrc={content.meta.songSrc}>
        <AnimatePresence mode="wait">
          {showOpening ? (
            <motion.div
              key="opening"
              className="experience"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              <OpeningScreen onOpen={() => setShowOpening(false)} />
            </motion.div>
          ) : (
            <motion.div
              key="main"
              className="experience"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <ChapterNavigation />
              <MusicPlayer />
            </motion.div>
          )}
        </AnimatePresence>
        {adminOpen ? <AdminPanel /> : null}
      </MusicProvider>
    </MotionConfig>
  )
}
