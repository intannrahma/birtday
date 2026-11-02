import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useContent, useContentStore } from '../store/contentStore'

interface FieldDef {
  path: string
  label: string
  multiline?: boolean
}

interface SectionDef {
  id: string
  label: string
  fields: FieldDef[]
  note?: string
}

const sections: SectionDef[] = [
  {
    id: 'opening',
    label: 'Opening Screen',
    fields: [
      { path: 'opening.eyebrow', label: 'Eyebrow' },
      { path: 'opening.date', label: 'Date' },
      { path: 'opening.title', label: 'Title' },
      { path: 'opening.description', label: 'Description' },
      { path: 'opening.button', label: 'Button' },
      { path: 'opening.hint', label: 'Hint' },
    ],
  },
  {
    id: 'greeting',
    label: 'Birthday Greeting',
    fields: [
      { path: 'greeting.label', label: 'Chapter label' },
      { path: 'greeting.headline', label: 'Headline' },
      { path: 'greeting.body', label: 'Paragraphs — one per line', multiline: true },
    ],
  },
  {
    id: 'memories',
    label: 'Video Memories',
    fields: [
      { path: 'memories.label', label: 'Chapter label' },
      { path: 'memories.heading', label: 'Heading' },
      { path: 'memories.intro', label: 'Intro line' },
    ],
    note: 'Video files, posters, and captions are configured in src/data/media.ts.',
  },
  {
    id: 'closing',
    label: 'Thank You & Sorry',
    fields: [
      { path: 'closing.label', label: 'Chapter label' },
      { path: 'closing.heading', label: 'Heading' },
      { path: 'closing.paragraphs', label: 'Paragraphs — one per line', multiline: true },
    ],
  },
  {
    id: 'finale',
    label: 'A Prayer For You',
    fields: [
      { path: 'finale.label', label: 'Chapter label' },
      { path: 'finale.heading', label: 'Heading' },
      { path: 'finale.message', label: 'Message — one paragraph per line', multiline: true },
      { path: 'finale.final', label: 'Final sentence' },
    ],
  },
  {
    id: 'meta',
    label: 'Audio',
    fields: [
      { path: 'meta.songTitle', label: 'Song title' },
      { path: 'meta.songArtist', label: 'Song artist' },
      { path: 'meta.songSrc', label: 'Song path' },
    ],
    note: 'Default audio paths live in src/data/media.ts.',
  },
]

function getPath(source: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((accumulator, key) => {
    if (accumulator && typeof accumulator === 'object') {
      return (accumulator as Record<string, unknown>)[key]
    }
    return undefined
  }, source)
}

export const AdminPanel: React.FC = () => {
  const content = useContent()
  const { setContentAt, resetContent, setAdminOpen } = useContentStore()
  const [saved, setSaved] = useState(false)

  const getValue = (path: string): string => {
    const value = getPath(content, path)
    if (Array.isArray(value)) return value.join('\n')
    return typeof value === 'string' ? value : ''
  }

  const handleFieldChange = (field: FieldDef, raw: string) => {
    setContentAt(field.path, field.multiline ? raw.split('\n') : raw)
    setSaved(true)
    window.setTimeout(() => setSaved(false), 1200)
  }

  return (
    <>
      <div className="admin-backdrop" onClick={() => setAdminOpen(false)} />
      <motion.aside
        className="admin-panel"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
        role="dialog"
        aria-label="Admin mode"
      >
        <header className="admin-panel__head">
          <h3>Admin Mode</h3>
          <button className="admin-close-x" onClick={() => setAdminOpen(false)} aria-label="Close admin">
            <X size={18} />
          </button>
        </header>

        <div className="admin-panel__body">
          {sections.map((section) => (
            <section className="admin-section" key={section.id}>
              <h4>{section.label}</h4>
              {section.fields.map((field) => (
                <label className="admin-field" key={field.path}>
                  <span>{field.label}</span>
                  {field.multiline ? (
                    <textarea
                      rows={5}
                      value={getValue(field.path)}
                      onChange={(event) => handleFieldChange(field, event.target.value)}
                    />
                  ) : (
                    <input
                      type="text"
                      value={getValue(field.path)}
                      onChange={(event) => handleFieldChange(field, event.target.value)}
                    />
                  )}
                </label>
              ))}
              {section.note ? <p className="admin-hint">{section.note}</p> : null}
            </section>
          ))}
        </div>

        <footer className="admin-actions">
          <button onClick={resetContent}>Reset all text</button>
          <button className="is-primary" onClick={() => setAdminOpen(false)}>
            {saved ? 'Saved' : 'Done'}
          </button>
        </footer>
      </motion.aside>
    </>
  )
}
