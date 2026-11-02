
import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Film, AlertCircle } from 'lucide-react'
import type { VideoMemoryItem } from '../data/media'
import { fadeUp } from './reveal'
import { useMusic } from '../contexts/MusicContext'

type VideoStatus = 'idle' | 'ready' | 'error' | 'missing'

interface VideoMemoryProps {
  item: VideoMemoryItem
  order: number
}

export const VideoMemory: React.FC<VideoMemoryProps> = ({ item, order }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const { audioRef, duckVolume, restoreVolume } = useMusic()

  const duckedForVideoRef = useRef(false)

  const [status, setStatus] = useState<VideoStatus>(
    item.src ? 'idle' : 'missing'
  )
  const [started, setStarted] = useState(false)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const video = videoRef.current

    setStatus(item.src ? 'idle' : 'missing')
    setStarted(false)
    setPlaying(false)

    if (video && item.src) {
      video.pause()
      video.load()
    }

    return () => {
      if (duckedForVideoRef.current) {
        duckedForVideoRef.current = false
        restoreVolume()
      }
    }
  }, [item.src, restoreVolume])

  const duckMusicForVideo = () => {
    const audio = audioRef.current

    if (!audio || audio.paused || duckedForVideoRef.current) return

    duckVolume()
    duckedForVideoRef.current = true
  }

  const restoreMusicAfterVideo = () => {
    if (!duckedForVideoRef.current) return

    duckedForVideoRef.current = false
    restoreVolume()
  }

  const handlePlay = async () => {
    const video = videoRef.current

    if (!video || status !== 'ready') return

    try {
      await video.play()
    } catch (error) {
      console.error('Video playback failed:', error)
      setStatus('error')
      setPlaying(false)
      restoreMusicAfterVideo()
    }
  }

  const unavailable = status === 'error' || status === 'missing'

  return (
    <motion.article
      className={`video-template video-template--${item.template}`}
      custom={order + 2}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
    >
      <div className="video-template__head">
        <span className="video-template__label">{item.label}</span>
        <span className="video-template__rule" aria-hidden="true" />
      </div>

      <div className="video-template__body">
        <div className="video-frame">
          {item.src && status !== 'missing' ? (
            <video
              ref={videoRef}
              className="video-frame__video"
              src={item.src}
              poster={item.poster || undefined}
              preload="auto"
              playsInline
              controls={started}
              onCanPlay={() => setStatus('ready')}
              onError={() => {
                setStatus('error')
                setPlaying(false)
                restoreMusicAfterVideo()
              }}
              onPlay={() => {
                setStarted(true)
                setPlaying(true)
                duckMusicForVideo()
              }}
              onPause={() => {
                setPlaying(false)
                restoreMusicAfterVideo()
              }}
              onEnded={() => {
                setPlaying(false)
                restoreMusicAfterVideo()
              }}
            />
          ) : null}

          {unavailable ? (
            <div className="video-placeholder" role="status">
              <span className="video-placeholder__icon" aria-hidden="true">
                {status === 'error' ? (
                  <AlertCircle size={20} />
                ) : (
                  <Film size={20} />
                )}
              </span>

              <span className="video-placeholder__slot">{item.label}</span>

              <strong>
                {status === 'error'
                  ? 'This video could not be loaded.'
                  : 'YOUR VIDEO GOES HERE'}
              </strong>

              <span className="video-placeholder__detail">
                {status === 'error'
                  ? item.src
                  : `Add the file at ${item.src || 'public/videos/'}`}
              </span>
            </div>
          ) : null}

          {!unavailable && !started ? (
            <button
              type="button"
              className="video-play"
              onClick={handlePlay}
              disabled={status !== 'ready'}
              aria-label={`Play ${item.title}`}
            >
              <span className="video-play__ring" aria-hidden="true" />
              <Play size={20} strokeWidth={1.5} />
              <span>{status === 'ready' ? 'Play' : 'Loading...'}</span>
            </button>
          ) : null}

          {!unavailable && playing ? (
            <span className="video-frame__status" aria-hidden="true" />
          ) : null}

          <span className="video-frame__corner video-frame__corner--tl" aria-hidden="true" />
          <span className="video-frame__corner video-frame__corner--br" aria-hidden="true" />
        </div>

        <div className="video-template__copy">
          <h3 className="video-template__title">{item.title}</h3>
          <p className="video-template__description">{item.description}</p>

          {item.caption ? (
            <p className="video-template__caption">{item.caption}</p>
          ) : null}

          {unavailable ? (
            <p className="video-template__hint">
              Video slot ready. Add your file in <code>public/videos/</code>.
            </p>
          ) : null}
        </div>
      </div>
    </motion.article>
  )
}
