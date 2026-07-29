import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { TbCommand, TbCornerDownLeft } from 'react-icons/tb'
import { buildCommands } from '../../data/commands'
import { fuzzyScore } from '../../lib/fuzzyMatch'
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import type { Theme } from '../../hooks/useTheme'

interface CommandPaletteProps {
  open: boolean
  onClose: () => void
  theme: Theme
  onToggleTheme: () => void
}

export function CommandPalette({ open, onClose, theme, onToggleTheme }: CommandPaletteProps) {
  const reduced = useReducedMotion()
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const previousFocusRef = useRef<Element | null>(null)

  useLockBodyScroll(open)

  const commands = useMemo(() => buildCommands({ theme, onToggleTheme }), [theme, onToggleTheme])

  const filtered = useMemo(() => {
    return commands
      .map((command) => ({ command, score: fuzzyScore(query, command.label, command.keywords) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ command }) => command)
  }, [commands, query])

  useEffect(() => {
    if (!open) return
    previousFocusRef.current = document.activeElement
    setQuery('')
    setActiveIndex(0)
    const id = requestAnimationFrame(() => inputRef.current?.focus())
    return () => {
      cancelAnimationFrame(id)
      const previous = previousFocusRef.current
      if (previous instanceof HTMLElement) previous.focus()
    }
  }, [open])

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  function runCommand(index: number) {
    const command = filtered[index]
    if (!command) return
    command.action()
    onClose()
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => (filtered.length === 0 ? 0 : (i + 1) % filtered.length))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => (filtered.length === 0 ? 0 : (i - 1 + filtered.length) % filtered.length))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      runCommand(activeIndex)
    } else if (e.key === 'Tab') {
      e.preventDefault()
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
          style={{ paddingTop: '10dvh' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0.15 : 0.2 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="h-fit w-[92%] max-w-xl overflow-hidden rounded-2xl border border-border bg-surface/80 shadow-card backdrop-blur-xl"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: -12, scale: 0.98 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-border px-5 py-4">
              <TbCommand className="shrink-0 text-muted" size={18} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a command or search…"
                aria-label="Command search"
                className="w-full bg-transparent text-base text-ink outline-none placeholder:text-muted"
              />
              <kbd className="hidden shrink-0 rounded border border-border px-1.5 py-0.5 font-mono text-xs text-muted sm:block">
                Esc
              </kbd>
            </div>

            <ul role="listbox" className="max-h-80 overflow-y-auto p-2">
              {filtered.length === 0 && (
                <li className="px-3 py-6 text-center text-sm text-muted">No matching commands</li>
              )}
              {filtered.map((command, i) => (
                <li
                  key={command.id}
                  role="option"
                  aria-selected={i === activeIndex}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => runCommand(i)}
                  className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                    i === activeIndex ? 'bg-accent/15 text-accent' : 'text-ink'
                  }`}
                >
                  <span>{command.label}</span>
                  {i === activeIndex && <TbCornerDownLeft className="shrink-0" size={14} />}
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
