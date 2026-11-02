import React, { useEffect, useMemo, useRef } from 'react'

const MOTE_COUNT = 22
const ORB_COUNT = 3

function createRandom(seed: number) {
  let state = seed >>> 0
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0
    return state / 4294967296
  }
}

interface AmbienceProps {
  motes?: number
  orbs?: number
}

export const Ambience: React.FC<AmbienceProps> = ({ motes = MOTE_COUNT, orbs = ORB_COUNT }) => {
  const pointerRef = useRef<HTMLDivElement>(null)

  const moteList = useMemo(() => {
    const rand = createRandom(20231013)
    return Array.from({ length: motes }, (_, i) => ({
      id: `mote-${i}`,
      left: rand() * 100,
      size: 1 + rand() * 2.6,
      alpha: 0.12 + rand() * 0.32,
      duration: 18 + rand() * 24,
      delay: -rand() * 36,
      drift: rand() * 70 - 35,
    }))
  }, [motes])

  const orbList = useMemo(() => {
    const rand = createRandom(90210)
    return Array.from({ length: orbs }, (_, i) => ({
      id: `orb-${i}`,
      left: 8 + rand() * 72,
      top: 4 + rand() * 72,
      size: 28 + rand() * 42,
      alpha: 0.3 + rand() * 0.35,
      duration: 24 + rand() * 20,
      delay: -rand() * 14,
    }))
  }, [orbs])

  useEffect(() => {
    const el = pointerRef.current
    if (!el) return
    let frame = 0
    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        el.style.setProperty('--px', `${event.clientX}px`)
        el.style.setProperty('--py', `${event.clientY}px`)
      })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div className="ambient" aria-hidden="true">
      <div className="ambient__pointer" ref={pointerRef} />
      {orbList.map((orb) => (
        <span
          key={orb.id}
          className="ambient__orb"
          style={
            {
              left: `${orb.left}%`,
              top: `${orb.top}%`,
              '--orb-size': `${orb.size}vmin`,
              '--orb-alpha': orb.alpha,
              '--orb-duration': `${orb.duration}s`,
              '--orb-delay': `${orb.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}
      {moteList.map((mote) => (
        <span
          key={mote.id}
          className="ambient__mote"
          style={
            {
              left: `${mote.left}%`,
              '--mote-size': `${mote.size}px`,
              '--mote-alpha': mote.alpha,
              '--mote-duration': `${mote.duration}s`,
              '--mote-delay': `${mote.delay}s`,
              '--mote-drift': `${mote.drift}px`,
            } as React.CSSProperties
          }
        />
      ))}
      <span className="ambient__vignette" />
    </div>
  )
}
