import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { useMusic } from '../contexts/MusicContext'
import { useContent } from '../store/contentStore'
import { EASE } from './reveal'
import { Ambience } from './Ambience'

interface OpeningScreenProps {
  onOpen: () => void
}

export const OpeningScreen: React.FC<OpeningScreenProps> = ({ onOpen }) => {
  const { audioRef, setIsPlaying, setStarted, started } = useMusic()
  const c = useContent()
  const [unsealed, setUnsealed] = useState(false)

  const handleUnseal = async () => {
    if (audioRef.current && !started) {
      try {
        audioRef.current.volume = 0.28
        await audioRef.current.play()
        setIsPlaying(true)
        setStarted(true)
      } catch {
        setIsPlaying(false)
      }
    }
    setUnsealed(true)
  }

  const handleOpen = () => {
    onOpen()
  }

  const handleSkip = () => {
    onOpen()
  }

  return (
    <motion.div
      className="opening"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.6, ease: EASE }}
    >
      <Ambience motes={14} orbs={2} />
      <span className="opening__frame" aria-hidden="true" />

      <AnimatePresence mode="wait">
        {!unsealed ? (
          <motion.div
            key="envelope"
            className="opening__envelope"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20, transition: { duration: 0.7, ease: EASE } }}
            transition={{ duration: 1.4, ease: EASE }}
          >
            <button type="button" className="envelope__button" onClick={handleUnseal}>
              <div className="envelope">
                <div className="envelope__back" />
                <div className="envelope__flap" />
                <div className="envelope__body" />
                <div className="envelope__seal">
                  <span className="envelope__seal-mark" />
                </div>
              </div>
              <span className="envelope__hint">Buka amplopnya</span>
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            className="opening__content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.3, ease: EASE }}
          >
            <motion.p
              className="opening__eyebrow"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.25, ease: EASE }}
            >
              {c.opening.eyebrow}
            </motion.p>

            <motion.div
              className="opening__date-row"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.4, ease: EASE }}
            >
              <span className="opening__date-line" aria-hidden="true" />
              <span className="opening__date">{c.opening.date}</span>
              <span className="opening__date-line" aria-hidden="true" />
            </motion.div>

            <motion.h1
              className="opening__title opening__title--celebration"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, delay: 0.55, ease: EASE }}
            >
              <span className="opening__spark opening__spark--left" aria-hidden="true">
                <Sparkles size={18} strokeWidth={1.2} />
              </span>
              {c.opening.title}
              <span className="opening__spark opening__spark--right" aria-hidden="true">
                <Sparkles size={13} strokeWidth={1.2} />
              </span>
            </motion.h1>

            <motion.div
              className="opening__flourish"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 1.2, delay: 0.95, ease: EASE }}
              aria-hidden="true"
            >
              <span className="opening__flourish-line" />
              <span className="opening__flourish-diamond" />
              <span className="opening__flourish-line" />
            </motion.div>

            <motion.p
              className="opening__description"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 1.1, ease: EASE }}
            >
              {c.opening.description}
            </motion.p>

            <motion.button
              type="button"
              className="opening__button"
              onClick={handleOpen}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 1.4, ease: EASE }}
            >
              {c.opening.button}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="opening__footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 1.8 }}
      >
        <span className="opening__hint">{c.opening.hint}</span>
        <button type="button" className="opening__skip" onClick={handleSkip}>
          Skip opening
        </button>
      </motion.div>
    </motion.div>
  )
}
