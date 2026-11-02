import React from 'react'
import { motion } from 'framer-motion'
import { useContent } from '../store/contentStore'
import { fadeUp } from '../components/reveal'
import { Ambience } from '../components/Ambience'
import { ChapterHeader } from '../components/ChapterHeader'

export const GreetingChapter: React.FC = () => {
  const c = useContent()

  return (
    <section className="chapter chapter--greeting">
      <div className="chapter__glow">
        <Ambience motes={12} orbs={2} />
      </div>

      <div className="chapter__inner">
        <div className="chapter__content greeting__layout">
          <div className="greeting__lead">
            <ChapterHeader
              label={c.greeting.label}
              title={c.greeting.headline}
              titleAs="h1"
              className="greeting__header"
            />
            <motion.span
              className="greeting__line"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 1.6, delay: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
              aria-hidden="true"
            />
          </div>

          <div className="greeting__body">
            {c.greeting.body.map((paragraph, index) => (
              <motion.p
                key={index}
                custom={index + 2}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
              >
                {paragraph}
              </motion.p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
