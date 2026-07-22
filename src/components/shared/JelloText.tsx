import { useReducedMotion } from '../../hooks/useReducedMotion'

interface JelloTextProps {
  text: string
  className?: string
}

/** Splits text into per-letter spans with the hero's squash/stretch hover effect. Wraps only between words. */
export function JelloText({ text, className = '' }: JelloTextProps) {
  const reduced = useReducedMotion()
  const words = text.split(' ')

  return (
    <span className={className}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block whitespace-nowrap">
          {[...word].map((char, charIndex) => (
            <span
              key={charIndex}
              className={`inline-block hover:text-gradient-accent ${reduced ? '' : 'hover:animate-jello'}`}
            >
              {char}
            </span>
          ))}
          {wordIndex < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </span>
  )
}
