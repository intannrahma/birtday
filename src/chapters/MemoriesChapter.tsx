import React from 'react'
import { motion } from 'framer-motion'
import { useContent } from '../store/contentStore'
import { fadeUp } from '../components/reveal'
import { Ambience } from '../components/Ambience'
import { VideoMemory } from '../components/VideoMemory'

export const MemoriesChapter: React.FC = () => {
  const c = useContent()

  return (
    <section className="chapter chapter--memories">
      <div className="chapter__glow">
        <Ambience motes={10} orbs={2} />
      </div>

      <div className="chapter__inner">
        <div className="chapter__content">
          <header className="chapter-header memories__header">
            <motion.p
              className="chapter-label"
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
            >
              {c.memories.label}
            </motion.p>
            <motion.h2
              className="title-section"
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
            >
              {c.memories.heading}
            </motion.h2>
            <motion.p
              className="lede"
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
            >
              {c.memories.intro}
            </motion.p>
          </header>

          <div className="video-list" data-no-advance>
            {c.memories.videos.map((video, index) => (
              <VideoMemory key={video.id} item={video} order={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
