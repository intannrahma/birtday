import React from 'react'
import { Volume2, VolumeX, Play, Pause } from 'lucide-react'
import { useMusic } from '../contexts/MusicContext'
import { useContent } from '../store/contentStore'
import { motion } from 'framer-motion'

export const MusicPlayer: React.FC = () => {
  const {
    audioRef,
    isPlaying,
    setIsPlaying,
    isMuted,
    setIsMuted,
    started,
    setStarted,
    unavailable,
  } = useMusic()
  const c = useContent()

  const togglePlay = async () => {
    const audio = audioRef.current
    if (!audio || unavailable) return

    if (!started) {
      audio.volume = 0.28
      setStarted(true)
    }

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
      return
    }

    try {
      await audio.play()
      setIsPlaying(true)
    } catch {
      setIsPlaying(false)
    }
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return
    const nextMuted = !isMuted
    audio.muted = nextMuted
    setIsMuted(nextMuted)
  }

  return (
    <motion.div
      className={`music-pill${isPlaying ? ' is-playing' : ''}${unavailable ? ' is-missing' : ''}`}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.35 }}
      title={
        unavailable
          ? 'Add public/audio/birthday-song.mp3 to enable the song'
          : `${c.meta.songTitle} — ${c.meta.songArtist}`
      }
    >
      <button
        type="button"
        className="music-pill__icon"
        onClick={togglePlay}
        disabled={unavailable}
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
        aria-pressed={isPlaying}
      >
        {isPlaying ? <Pause size={13} strokeWidth={1.6} /> : <Play size={13} strokeWidth={1.6} />}
      </button>

      <span className="music-pill__label">{c.meta.songTitle}</span>
      <span className="music-pill__artist">{c.meta.songArtist}</span>

      <span className="music-pill__bars" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>

      <button
        type="button"
        className="music-pill__icon"
        onClick={toggleMute}
        aria-label={isMuted ? 'Unmute music' : 'Mute music'}
        aria-pressed={isMuted}
      >
        {isMuted ? <VolumeX size={13} strokeWidth={1.6} /> : <Volume2 size={13} strokeWidth={1.6} />}
      </button>
    </motion.div>
  )
}
