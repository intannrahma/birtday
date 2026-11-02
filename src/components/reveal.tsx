import React from 'react'
import { motion, type Variants } from 'framer-motion'

export const EASE: [number, number, number, number] = [0.22, 0.61, 0.36, 1]

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1.15, delay: 0.2 + i * 0.22, ease: EASE },
  }),
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: (i: number = 0) => ({
    opacity: 1,
    transition: { duration: 1.5, delay: 0.2 + i * 0.22, ease: EASE },
  }),
}

interface RevealProps {
  text: string
  className?: string
  delay?: number
  step?: number
  as?: 'h1' | 'h2' | 'p' | 'span' | 'div' | 'blockquote'
}

export const WordsReveal: React.FC<RevealProps> = ({
  text,
  className,
  delay = 0.35,
  step = 0.14,
  as = 'div',
}) => {
  const words = text.split(' ')
  const Tag = motion[as]
  return (
    <Tag
      className={className}
      initial="hidden"
      animate="visible"
      variants={{}}
      aria-label={text}
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          variants={{
            hidden: { opacity: 0, y: '0.35em', display: 'inline-block' },
            visible: {
              opacity: 1,
              y: 0,
              display: 'inline-block',
              transition: { duration: 1.05, delay: delay + i * step, ease: EASE },
            },
          }}
          style={{ display: 'inline-block' }}
        >
          {word}
          {i < words.length - 1 ? ' ' : ''}
        </motion.span>
      ))}
    </Tag>
  )
}

export const ChapterHead: React.FC<{
  index: string
  eyebrow?: string
  className?: string
}> = ({ index, eyebrow, className }) => (
  <motion.div
    className={className}
    custom={0}
    variants={fadeUp}
    initial="hidden"
    animate="visible"
    style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}
  >
    <span className="chapter-index">{index}</span>
    {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
  </motion.div>
)
