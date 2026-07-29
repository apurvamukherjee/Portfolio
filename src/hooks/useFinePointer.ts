import { useEffect, useState } from 'react'

const QUERY = '(pointer: fine)'

/** True on mouse/trackpad input, false on touch-only devices. */
export function useFinePointer(): boolean {
  const [fine, setFine] = useState(() => (typeof window === 'undefined' ? false : window.matchMedia(QUERY).matches))

  useEffect(() => {
    const mql = window.matchMedia(QUERY)
    const onChange = () => setFine(mql.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return fine
}
