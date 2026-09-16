import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { runTerminalCommand } from '../../data/terminalCommands'
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll'
import { appleEase, iosSpringSoft } from '../../lib/motion'
interface TerminalProps {
  open: boolean
  onClose: () => void
}

interface TranscriptLine {
  id: number
  type: 'input' | 'output'
  text: string
}

const PROMPT = 'guest@apurva-portfolio:~$'

let lineId = 0

/**
 * macOS traffic lights. Real ones hide their glyphs until the window group is hovered, which is
 * why this reads as a title bar rather than three coloured dots.
 */
function TrafficLights({ onClose }: { onClose: () => void }) {
  return (
    <div className="group/lights flex shrink-0 items-center gap-2">
      <button
        type="button"
        aria-label="Close terminal"
        onClick={onClose}
        className="flex h-3 w-3 items-center justify-center rounded-full bg-[#ff5f57] text-[7px] font-bold leading-none text-black/60 transition-transform active:scale-90"
      >
        <span className="opacity-0 transition-opacity group-hover/lights:opacity-100">×</span>
      </button>
      <span aria-hidden className="h-3 w-3 rounded-full bg-[#febc2e]" />
      <span aria-hidden className="h-3 w-3 rounded-full bg-[#28c840]" />
    </div>
  )
}

export function Terminal({ open, onClose }: TerminalProps) {
  const reduced = useReducedMotion()
  const [transcript, setTranscript] = useState<TranscriptLine[]>([])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useLockBodyScroll(open)

  useEffect(() => {
    if (!open) return
    setTranscript([{ id: lineId++, type: 'output', text: "Welcome. Type 'help' to see available commands." }])
    setInput('')
    setHistory([])
    setHistoryIndex(0)
    const id = requestAnimationFrame(() => inputRef.current?.focus())
    return () => cancelAnimationFrame(id)
  }, [open])

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [transcript])

  function appendOutput(lines: string[]) {
    if (lines.length === 0) return
    setTranscript((prev) => [...prev, ...lines.map((text) => ({ id: lineId++, type: 'output' as const, text }))])
  }

  function submit() {
    const raw = input
    const trimmed = raw.trim()
    setTranscript((prev) => [...prev, { id: lineId++, type: 'input', text: raw }])
    setInput('')

    if (trimmed) {
      setHistory((prev) => {
        const next = [...prev, trimmed]
        setHistoryIndex(next.length)
        return next
      })
    }

    const name = trimmed.split(/\s+/)[0]?.toLowerCase()
    if (name === 'clear') {
      setTranscript([])
      return
    }
    if (name === 'exit') {
      onClose()
      return
    }

    appendOutput(runTerminalCommand(trimmed))
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      submit()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (history.length === 0) return
      const nextIndex = Math.max(0, historyIndex - 1)
      setHistoryIndex(nextIndex)
      setInput(history[nextIndex] ?? '')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (history.length === 0) return
      const nextIndex = Math.min(history.length, historyIndex + 1)
      setHistoryIndex(nextIndex)
      setInput(nextIndex === history.length ? '' : history[nextIndex])
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: appleEase }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Hidden terminal"
            className="window-chrome flex h-[min(70dvh,32rem)] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-white/10 bg-black/85 font-mono text-sm text-accent vibrancy"
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 12 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 8 }}
            transition={reduced ? { duration: 0.15 } : iosSpringSoft}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative flex items-center gap-3 border-b border-white/10 bg-white/[0.06] px-4 py-2.5">
              <TrafficLights onClose={onClose} />
              <span className="pointer-events-none absolute inset-x-0 truncate text-center text-xs font-semibold text-muted">
                guest — zsh — 80×24
              </span>
            </div>

            <div ref={scrollRef} className="thin-scrollbar flex-1 overflow-y-auto px-4 py-3 leading-relaxed">
              {transcript.map((line) => (
                <motion.div
                  key={line.id}
                  initial={reduced ? false : { opacity: 0, y: 2 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18, ease: appleEase }}
                  className="whitespace-pre-wrap"
                >
                  {line.type === 'input' ? (
                    <>
                      <span className="text-[#28c840]">{PROMPT}</span> <span className="text-white/90">{line.text}</span>
                    </>
                  ) : (
                    <span className="text-white/65">{line.text}</span>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="flex items-center gap-2 border-t border-white/10 px-4 py-3">
              <span className="hidden shrink-0 text-[#28c840] sm:inline">{PROMPT}</span>
              <span className="shrink-0 text-[#28c840] sm:hidden">$</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                spellCheck={false}
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                aria-label="Terminal input"
                className="w-full bg-transparent text-base text-white/90 caret-[#28c840] outline-none"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
