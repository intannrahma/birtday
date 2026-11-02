import React from 'react'
import { motion } from 'framer-motion'
import { fadeUp } from './reveal'

interface ChapterHeaderProps {
  label: string
  title: string
  align?: 'left' | 'center'
  className?: string
  titleAs?: 'h1' | 'h2'
}

export const ChapterHeader: React.FC<ChapterHeaderProps> = ({
  label,
  title,
  align = 'left',
  className,
  titleAs = 'h2',
}) => {
  const Title = titleAs === 'h1' ? motion.h1 : motion.h2

  return (
    <header className={`chapter-header chapter-header--${align}${className ? ` ${className}` : ''}`}>
      <motion.p
        className="chapter-label"
        custom={0}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        {label}
      </motion.p>
      <Title
        className="title-section"
        custom={1}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        {title}
      </Title>
    </header>
  )
}
