import React from 'react'

export interface RailItem {
  key: string
  label: string
}

interface ProgressRailProps {
  items: RailItem[]
  currentIndex: number
  onSelect: (index: number) => void
}

export const ProgressRail: React.FC<ProgressRailProps> = ({ items, currentIndex, onSelect }) => {
  const total = items.length
  const progress = total > 0 ? ((currentIndex + 1) / total) * 100 : 0

  return (
    <nav className="rail" aria-label="Navigasi bab" data-no-advance>
      <span className="rail__line" aria-hidden="true">
        <span className="rail__line-fill" style={{ height: `${progress}%` }} />
      </span>

      <ul className="rail__list">
        {items.map((item, index) => (
          <li key={item.key}>
            <button
              type="button"
              className={`rail__dot${index === currentIndex ? ' is-active' : ''}`}
              onClick={() => onSelect(index)}
              aria-current={index === currentIndex ? 'true' : undefined}
              aria-label={`Buka ${item.label}`}
            >
              <span className="rail__label">{item.label}</span>
              <span className="rail__mark" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
