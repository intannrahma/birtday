import React from 'react'
import { ChapterKey } from '../content/content'
import { GreetingChapter } from '../chapters/GreetingChapter'
import { MemoriesChapter } from '../chapters/MemoriesChapter'
import { ClosingChapter } from '../chapters/ClosingChapter'
import { FinaleChapter } from '../chapters/FinaleChapter'

interface ChapterProps {
  chapterKey: ChapterKey
}

export const Chapter: React.FC<ChapterProps> = ({ chapterKey }) => {
  switch (chapterKey) {
    case 'greeting':
      return <GreetingChapter />
    case 'memories':
      return <MemoriesChapter />
    case 'closing':
      return <ClosingChapter />
    case 'finale':
      return <FinaleChapter />
    default:
      return null
  }
}
