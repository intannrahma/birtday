import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ExperienceContent, defaultContent } from '../content/content'

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function mergeDeep<T>(base: T, patch: DeepPartial<T> | undefined): T {
  if (!patch) return base
  if (Array.isArray(base) || Array.isArray(patch)) return (patch as T) ?? base
  if (isObject(base) && isObject(patch)) {
    const result: Record<string, unknown> = { ...base }
    for (const key of Object.keys(patch)) {
      const baseValue = (base as Record<string, unknown>)[key]
      const patchValue = patch[key as keyof typeof patch]
      if (patchValue === undefined) continue
      result[key] =
        isObject(baseValue) && isObject(patchValue)
          ? mergeDeep(baseValue, patchValue)
          : patchValue
    }
    return result as T
  }
  return (patch as T) ?? base
}

function setPath(target: Record<string, unknown>, path: string[], value: unknown) {
  let cursor = target
  for (let index = 0; index < path.length - 1; index += 1) {
    const key = path[index]
    if (!isObject(cursor[key])) cursor[key] = {}
    cursor = cursor[key] as Record<string, unknown>
  }
  cursor[path[path.length - 1]] = value
}

interface ContentStore {
  overrides: DeepPartial<ExperienceContent>
  adminOpen: boolean
  setContentAt: (path: string, value: unknown) => void
  resetContent: () => void
  setAdminOpen: (open: boolean) => void
  toggleAdmin: () => void
}

export const useContentStore = create<ContentStore>()(
  persist(
    (set, get) => ({
      overrides: {},
      adminOpen: false,
      setContentAt: (path, value) => {
        const next = { ...get().overrides } as Record<string, unknown>
        setPath(next, path.split('.'), value)
        set({ overrides: next as DeepPartial<ExperienceContent> })
      },
      resetContent: () => set({ overrides: {} }),
      setAdminOpen: (open) => set({ adminOpen: open }),
      toggleAdmin: () => set({ adminOpen: !get().adminOpen }),
    }),
    {
      name: 'birthday-experience-content',
      version: 3,
      migrate: () => ({ overrides: {}, adminOpen: false }),
    }
  )
)

export function useContent(): ExperienceContent {
  const overrides = useContentStore((state) => state.overrides)
  return mergeDeep(defaultContent, overrides)
}
