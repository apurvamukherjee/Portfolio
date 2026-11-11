import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Overlay = 'none' | 'palette' | 'terminal'
export type ProjectsView = 'shelf' | 'list'

const MATRIX_MS = 10_000
let matrixTimer: ReturnType<typeof setTimeout> | undefined

interface Ui {
  overlay: Overlay
  /** Konami / `matrix` command: green rain over the whole page for a few seconds. */
  matrix: boolean
  /** Tech the Projects section is filtered to, as the visitor clicked it. */
  tech: string | null
  view: ProjectsView
  setOverlay: (overlay: Overlay) => void
  /** Closes `which` only if it is still the one showing, so a command that opens another overlay isn't undone. */
  closeOverlay: (which: Overlay) => void
  unlockMatrix: () => void
  setTech: (tech: string | null) => void
  setView: (view: ProjectsView) => void
}

export const useUi = create<Ui>()(
  persist(
    (set, get) => ({
      overlay: 'none',
      matrix: false,
      tech: null,
      view: 'list',
      setOverlay: (overlay) => set({ overlay }),
      closeOverlay: (which) => {
        if (get().overlay === which) set({ overlay: 'none' })
      },
      unlockMatrix: () => {
        clearTimeout(matrixTimer)
        set({ matrix: true })
        matrixTimer = setTimeout(() => set({ matrix: false }), MATRIX_MS)
      },
      setTech: (tech) => set({ tech }),
      setView: (view) => set({ view }),
    }),
    { name: 'portfolio:ui', partialize: (s) => ({ view: s.view }) },
  ),
)
