
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

interface MusicContextType {
  audioRef: React.RefObject<HTMLAudioElement | null>
  isPlaying: boolean
  setIsPlaying: (playing: boolean) => void
  isMuted: boolean
  setIsMuted: (muted: boolean) => void
  volume: number
  setVolume: (volume: number) => void
  duckVolume: () => void
  restoreVolume: () => void
  started: boolean
  setStarted: (started: boolean) => void
  unavailable: boolean
}

const MusicContext = createContext<MusicContextType | undefined>(undefined)

interface MusicProviderProps {
  children: React.ReactNode
  songSrc: string
}

export const MusicProvider: React.FC<MusicProviderProps> = ({
  children,
  songSrc,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const volumeRef = useRef(0.36)
  const previousVolumeRef = useRef(0.36)
  const duckCountRef = useRef(0)
  const fadeFrameRef = useRef<number | null>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolumeState] = useState(0.36)
  const [started, setStarted] = useState(false)
  const [unavailable, setUnavailable] = useState(false)

  const fadeAudio = useCallback(
    (audio: HTMLAudioElement, target: number, duration = 1400) => {
      if (fadeFrameRef.current !== null) {
        cancelAnimationFrame(fadeFrameRef.current)
      }

      const startVolume = audio.volume
      const difference = target - startVolume
      const startTime = performance.now()

      const step = (now: number) => {
        const progress = Math.min((now - startTime) / duration, 1)
        const eased = progress * progress * (3 - 2 * progress)

        audio.volume = Math.max(
          0,
          Math.min(1, startVolume + difference * eased)
        )

        if (progress < 1) {
          fadeFrameRef.current = requestAnimationFrame(step)
        } else {
          fadeFrameRef.current = null
        }
      }

      fadeFrameRef.current = requestAnimationFrame(step)
    },
    []
  )

  const setVolume = useCallback((nextVolume: number) => {
    const next = Math.max(0, Math.min(1, nextVolume))

    volumeRef.current = next
    setVolumeState(next)
    duckCountRef.current = 0

    if (fadeFrameRef.current !== null) {
      cancelAnimationFrame(fadeFrameRef.current)
      fadeFrameRef.current = null
    }

    if (audioRef.current) {
      audioRef.current.volume = next
    }
  }, [])

  const duckVolume = useCallback(() => {
    const audio = audioRef.current

    if (!audio || audio.paused) return

    duckCountRef.current += 1

    if (duckCountRef.current === 1) {
      previousVolumeRef.current = audio.volume
      fadeAudio(audio, 0, 1400)
    }
  }, [fadeAudio])

  const restoreVolume = useCallback(() => {
    const audio = audioRef.current

    if (!audio || duckCountRef.current === 0) return

    duckCountRef.current -= 1

    if (duckCountRef.current === 0 && !audio.muted) {
      fadeAudio(audio, previousVolumeRef.current, 1400)
    }
  }, [fadeAudio])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.pause()
    audio.src = songSrc
    audio.load()

    audio.volume = volumeRef.current
    audio.muted = isMuted
    duckCountRef.current = 0

    setIsPlaying(false)
    setUnavailable(false)

    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    const onError = () => {
      setUnavailable(true)
      setIsPlaying(false)
    }
    const onReady = () => setUnavailable(false)

    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('error', onError)
    audio.addEventListener('canplay', onReady)

    return () => {
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('error', onError)
      audio.removeEventListener('canplay', onReady)

      if (fadeFrameRef.current !== null) {
        cancelAnimationFrame(fadeFrameRef.current)
        fadeFrameRef.current = null
      }
    }
  }, [songSrc, isMuted])

  return (
    <MusicContext.Provider
      value={{
        audioRef,
        isPlaying,
        setIsPlaying,
        isMuted,
        setIsMuted,
        volume,
        setVolume,
        duckVolume,
        restoreVolume,
        started,
        setStarted,
        unavailable,
      }}
    >
      <audio ref={audioRef} preload="auto" loop />
      {children}
    </MusicContext.Provider>
  )
}

export const useMusic = () => {
  const context = useContext(MusicContext)

  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider')
  }

  return context
}
