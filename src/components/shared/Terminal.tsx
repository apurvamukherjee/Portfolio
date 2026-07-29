import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { TbX } from 'react-icons/tb'
import { runTerminalCommand } from '../../data/terminalCommands'
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll'
import { useReducedMotion } from '../../hooks/useReducedMotion'

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
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Hidden terminal"
            className="flex h-[min(70dvh,32rem)] w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-accent-deep bg-black font-mono text-sm text-accent shadow-card"
            initial={reduced ? { opacity: 0 } : { opacity: 0, scaleY: 0.85 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, scaleY: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, scaleY: 0.9 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 border-b border-accent-deep/60 px-4 py-2 text-xs text-accent/70">
              <span className="min-w-0 truncate">{PROMPT}</span>
              <button
                type="button"
                aria-label="Close terminal"
                onClick={onClose}
                className="text-accent/70 transition-colors hover:text-accent"
              >
                <TbX size={16} />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3">
              {transcript.map((line) => (
                <div key={line.id} className={`whitespace-pre-wrap ${line.type === 'input' ? 'text-accent' : 'text-accent/70'}`}>
                  {line.type === 'input' ? `${PROMPT} ${line.text}` : line.text}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 border-t border-accent-deep/60 px-4 py-3">
              <span className="hidden shrink-0 text-accent sm:inline">{PROMPT}</span>
              <span className="shrink-0 text-accent sm:hidden">$</span>
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
                className="w-full bg-transparent text-base text-accent outline-none"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
