import { useEffect, useRef } from 'react'

/** Fires onTrigger on Ctrl/Cmd+K, from anywhere on the page (including while focused in a text field). */
export function useCommandPaletteShortcut(onTrigger: () => void) {
  const onTriggerRef = useRef(onTrigger)
  onTriggerRef.current = onTrigger

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        onTriggerRef.current()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
}
