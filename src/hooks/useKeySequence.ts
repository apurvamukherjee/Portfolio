import { useEffect, useRef } from 'react'

/**
 * Fires onMatch when the given key sequence is typed anywhere on the page. Uses a rolling
 * window (no timeout) so there's no "type fast enough" pressure. Ignores keystrokes while
 * focus is on an editable element or a modifier is held, so typing the sequence into a text
 * field (e.g. the command palette's own search box) never accidentally triggers it.
 */
export function useKeySequence(sequence: string[], onMatch: () => void) {
  const bufferRef = useRef<string[]>([])
  const onMatchRef = useRef(onMatch)
  onMatchRef.current = onMatch

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null
      const editable =
        !!target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)

      if (editable || e.metaKey || e.ctrlKey || e.altKey) {
        bufferRef.current = []
        return
      }

      bufferRef.current = [...bufferRef.current, e.key.toLowerCase()].slice(-sequence.length)
      if (bufferRef.current.length === sequence.length && bufferRef.current.every((k, i) => k === sequence[i])) {
        bufferRef.current = []
        onMatchRef.current()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [sequence])
}
