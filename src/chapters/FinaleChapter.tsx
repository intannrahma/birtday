import React from 'react'
import { motion } from 'framer-motion'
import { useContent } from '../store/contentStore'
import { fadeUp } from '../components/reveal'
import { Ambience } from '../components/Ambience'
import { ChapterHeader } from '../components/ChapterHeader'

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: 1.6,
    delay,
    ease: [0.22, 0.61, 0.36, 1] as [number, number, number, number],
  },
})

export const FinaleChapter: React.FC = () => {
  const c = useContent()

  return (
    <section className="chapter chapter--finale">
      <div className="chapter__glow">
        <Ambience motes={16} orbs={3} />
      </div>

      <div className="chapter__inner">
        <div className="chapter__content finale__layout">
          <ChapterHeader
            label={c.finale.label}
            title={c.finale.heading}
            align="center"
            titleAs="h1"
            className="finale__header"
          />

          <motion.div className="finale__message" {...fade(1.4)}>
            {c.finale.message.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </motion.div>

          <motion.div
            className="finale__divider"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 1.8, delay: 2.9, ease: [0.22, 0.61, 0.36, 1] }}
            aria-hidden="true"
          >
            <span />
          </motion.div>

          <motion.p className="finale__final" {...fade(3.4)}>
            {c.finale.final}
          </motion.p>

          <motion.p className="finale__breathe" {...fade(4.6)} aria-hidden="true">
            <span />
          </motion.p>
        </div>
      </div>
    </section>
  )
}
