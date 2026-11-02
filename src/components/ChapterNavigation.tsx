import React, { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Chapter } from './Chapter'
import { chapterOrder, ChapterKey } from '../content/content'
import { useContentStore } from '../store/contentStore'
import { EASE } from './reveal'

const INTERACTIVE_SELECTOR =
  'button, a, input, textarea, select, label, video, [role="button"], [contenteditable="true"], [data-no-advance]'

const AUTO_ADVANCE_SECONDS: Record<ChapterKey, number> = {
  greeting: 24,
  memories: 30,
  closing: 30,
  finale: 0,
}

const ACTIVITY_GRACE_MS = 2500

export const ChapterNavigation: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const adminOpen = useContentStore((state) => state.adminOpen)
  const rootRef = useRef<HTMLDivElement>(null)
  const elapsedRef = useRef(0)
  const lastActivityRef = useRef(0)
  const touchStart = useRef<{ x: number; y: number; blocked: boolean } | null>(null)
  const lastSwipeAt = useRef(0)

  const chapters = chapterOrder as readonly ChapterKey[]
  const total = chapters.length
  const currentKey = chapters[currentIndex]

  const goNext = useCallback(() => {
    setCurrentIndex((index) => Math.min(index + 1, total - 1))
  }, [total])

  const goPrev = useCallback(() => {
    setCurrentIndex((index) => Math.max(index - 1, 0))
  }, [])

  useEffect(() => {
    const match = window.location.hash.match(/^#c=(\d+)$/)
    if (match) {
      const chapterNumber = Number.parseInt(match[1], 10)
      if (chapterNumber >= 1 && chapterNumber <= total) setCurrentIndex(chapterNumber - 1)
    }
  }, [total])

  useEffect(() => {
    const nextHash = `#c=${currentIndex + 1}`
    if (window.location.hash !== nextHash && window.location.hash !== '#admin') {
      window.history.replaceState(null, '', nextHash)
    }
  }, [currentIndex])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) return
      if (event.key === 'ArrowRight' || event.key === 'PageDown') {
        event.preventDefault()
        goNext()
      }
      if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
        event.preventDefault()
        goPrev()
      }
      if (event.key === 'Home') setCurrentIndex(0)
      if (event.key === 'End') setCurrentIndex(total - 1)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goNext, goPrev, total])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const markActivity = () => {
      lastActivityRef.current = Date.now()
    }

    root.addEventListener('scroll', markActivity, true)
    root.addEventListener('wheel', markActivity, { passive: true })
    root.addEventListener('touchmove', markActivity, { passive: true })

    return () => {
      root.removeEventListener('scroll', markActivity, true)
      root.removeEventListener('wheel', markActivity)
      root.removeEventListener('touchmove', markActivity)
    }
  }, [])

  useEffect(() => {
    const seconds = AUTO_ADVANCE_SECONDS[currentKey]
    if (!seconds || currentIndex >= total - 1) {
      setProgress(currentIndex >= total - 1 ? 1 : 0)
      return
    }

    elapsedRef.current = 0
    lastActivityRef.current = 0
    setProgress(0)

    let last = performance.now()
    const timer = window.setInterval(() => {
      const now = performance.now()
      const delta = (now - last) / 1000
      last = now

      if (adminOpen || document.hidden) return
      if (Date.now() - lastActivityRef.current < ACTIVITY_GRACE_MS) return

      const media = rootRef.current?.querySelectorAll<HTMLMediaElement>('video, audio')
      const mediaPlaying = media
        ? Array.from(media).some((element) => !element.paused && !element.ended)
        : false
      if (mediaPlaying) return

      elapsedRef.current += delta
      const next = Math.min(1, elapsedRef.current / seconds)
      setProgress(next)

      if (next >= 1) {
        window.clearInterval(timer)
        setCurrentIndex((index) => Math.min(index + 1, total - 1))
      }
    }, 200)

    return () => window.clearInterval(timer)
  }, [adminOpen, currentIndex, currentKey, total])

  const onTouchStart = (event: React.TouchEvent) => {
    const target = event.target as HTMLElement
    const blocked = Boolean(target.closest(INTERACTIVE_SELECTOR))
    const touch = event.touches[0]
    touchStart.current = { x: touch.clientX, y: touch.clientY, blocked }
  }

  const onTouchEnd = (event: React.TouchEvent) => {
    if (!touchStart.current) return
    const start = touchStart.current
    touchStart.current = null
    if (start.blocked) return

    const touch = event.changedTouches[0]
    const dx = touch.clientX - start.x
    const dy = touch.clientY - start.y

    if (Math.abs(dx) > 64 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      lastSwipeAt.current = Date.now()
      if (dx < 0) goNext()
      else goPrev()
    }
  }

  const onClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.button !== 0) return
    if (Date.now() - lastSwipeAt.current < 400) return
    if (window.getSelection()?.toString()) return
    const target = event.target as HTMLElement | null
    if (target?.closest(INTERACTIVE_SELECTOR)) return
    lastActivityRef.current = Date.now()
    goNext()
  }

  return (
    <div
      ref={rootRef}
      className="experience"
      data-chapter={currentKey}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onClick={onClick}
    >
      <div className="chapter-viewport">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentKey}
            className="chapter-slide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } }}
            exit={{ opacity: 0, y: -10, transition: { duration: 0.35, ease: EASE } }}
          >
            <Chapter chapterKey={currentKey} />
          </motion.div>
        </AnimatePresence>
      </div>

      {AUTO_ADVANCE_SECONDS[currentKey] > 0 ? (
        <div className="autoplay-progress" aria-hidden="true">
          <div
            className="autoplay-progress__fill"
            style={{ transform: `scaleX(${progress})` }}
          />
        </div>
      ) : null}
    </div>
  )
}
