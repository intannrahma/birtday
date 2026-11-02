import React from 'react'
import { motion } from 'framer-motion'
import { useContent } from '../store/contentStore'
import { fadeUp } from '../components/reveal'
import { Ambience } from '../components/Ambience'
import { ChapterHeader } from '../components/ChapterHeader'

export const ClosingChapter: React.FC = () => {
  const c = useContent()

  return (
    <section className="chapter chapter--wishes">
      <div className="chapter__glow">
        <Ambience motes={10} orbs={2} />
      </div>

      <div className="chapter__inner">
        <div className="chapter__content wishes__layout">
          <motion.article
            className="letter"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.3, ease: [0.22, 0.61, 0.36, 1] }}
          >
            <span className="letter__edge" aria-hidden="true" />
            <span className="letter__seal" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M12 20s-7-4.35-7-9a4 4 0 0 1 7-2.65A4 4 0 0 1 19 11c0 4.65-7 9-7 9Z" />
              </svg>
            </span>

            <ChapterHeader label={c.closing.label} title={c.closing.heading} className="letter__head" />

            <div className="letter__body">
              {c.closing.paragraphs.map((paragraph, index) => (
                <motion.p
                  key={index}
                  className={index === c.closing.paragraphs.length - 1 ? 'letter__closing' : undefined}
                  custom={index + 2}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>

            <motion.div
              className="letter__sign"
              custom={c.closing.paragraphs.length + 2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              aria-hidden="true"
            >
              <span className="letter__sign-line" />
              <span className="letter__sign-mark" />
            </motion.div>
          </motion.article>
        </div>
      </div>
    </section>
  )
}
