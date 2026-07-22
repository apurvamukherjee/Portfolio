import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, type TargetAndTransition } from 'framer-motion'
import { useReducedMotion } from '../../hooks/useReducedMotion'

type Wobble = 'none' | 'close' | 'minimize' | 'maximize'

const SNIPPETS = [
  <>
    <p className="text-white/90">
      <span className="text-accent">const</span> dev = <span className="text-accent">new</span> Engineer();
    </p>
    <p className="text-white/90">
      dev.<span className="text-accent">build</span>(<span className="text-emerald-400">'ideas'</span>);
    </p>
    <p className="text-white/90">
      dev.<span className="text-accent">ship</span>();
    </p>
  </>,
  <>
    <p className="text-white/90">
      <span className="text-accent">while</span> (awake) {'{'}
    </p>
    <p className="pl-4 text-white/90">
      learn(); build(); <span className="text-emerald-400">ship</span>();
    </p>
    <p className="text-white/90">{'}'}</p>
  </>,
  <>
    <p className="text-white/90">
      <span className="text-accent">export default</span> function
    </p>
    <p className="text-white/90">
      Apurva() {'{'} <span className="text-accent">return</span> <span className="text-emerald-400">'shipped'</span>; {'}'}
    </p>
  </>,
]

const WOBBLE_LABEL: Record<Exclude<Wobble, 'none'>, string> = {
  close: 'nice try — not closing that easily',
  minimize: 'staying right here',
  maximize: 'already living my best life',
}

/** Minimal laptop/terminal mockup — idle float, cursor-parallax tilt, cycling snippets, clickable traffic lights. */
export function HeroIllustration() {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness: 150, damping: 20 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 150, damping: 20 })

  const [snippetIndex, setSnippetIndex] = useState(0)
  const [wobble, setWobble] = useState<Wobble>('none')

  useEffect(() => {
    if (reduced) return
    const timer = setInterval(() => setSnippetIndex((i) => (i + 1) % SNIPPETS.length), 3800)
    return () => clearInterval(timer)
  }, [reduced])

  useEffect(() => {
    if (wobble === 'none') return
    const timer = setTimeout(() => setWobble('none'), 900)
    return () => clearTimeout(timer)
  }, [wobble])

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (reduced || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  function handleMouseLeave() {
    x.set(0)
    y.set(0)
  }

  const wobbleAnimation: Record<Wobble, TargetAndTransition> = {
    none: { scale: 1, rotate: 0 },
    close: { rotate: [0, -3, 3, -2, 2, 0], transition: { duration: 0.5 } },
    minimize: { scale: [1, 0.85, 1], transition: { duration: 0.6 } },
    maximize: { scale: [1, 1.06, 1], transition: { duration: 0.6 } },
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative mx-auto w-full max-w-xl"
      style={{ perspective: 1200 }}
    >
      <div aria-hidden className="absolute inset-8 -z-10 rounded-full bg-accent/25 blur-[100px]" />

      <motion.div
        style={reduced ? undefined : { rotateX, rotateY, transformStyle: 'preserve-3d' }}
        animate={reduced ? wobbleAnimation[wobble] : { y: [0, -14, 0], ...wobbleAnimation[wobble] }}
        transition={reduced ? undefined : { y: { duration: 5, repeat: Infinity, ease: 'easeInOut' } }}
      >
        <div className="rounded-t-2xl border border-white/10 bg-[#0d0d12] p-4 shadow-2xl">
          <div className="relative mb-4 flex items-center gap-2">
            <button
              type="button"
              aria-label="Easter egg: close"
              onClick={() => setWobble('close')}
              className="h-3.5 w-3.5 rounded-full bg-red-500 transition-transform hover:scale-125"
            />
            <button
              type="button"
              aria-label="Easter egg: minimize"
              onClick={() => setWobble('minimize')}
              className="h-3.5 w-3.5 rounded-full bg-yellow-500 transition-transform hover:scale-125"
            />
            <button
              type="button"
              aria-label="Easter egg: maximize"
              onClick={() => setWobble('maximize')}
              className="h-3.5 w-3.5 rounded-full bg-green-500 transition-transform hover:scale-125"
            />

            <AnimatePresence>
              {wobble !== 'none' && (
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="ml-2 truncate text-xs text-white/50"
                >
                  {WOBBLE_LABEL[wobble]}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <div className="relative min-h-[130px] overflow-hidden rounded-lg bg-black/40 p-5 text-base leading-relaxed sm:text-lg">
            <AnimatePresence mode="wait">
              <motion.div
                key={snippetIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4 }}
                className="space-y-2"
              >
                {SNIPPETS[snippetIndex]}
              </motion.div>
            </AnimatePresence>
            <motion.span
              animate={reduced ? undefined : { opacity: [1, 0] }}
              transition={reduced ? undefined : { duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
              className="mt-1 inline-block h-4 w-2.5 bg-accent align-middle"
            />
          </div>
        </div>
        <div className="mx-auto h-4 w-full rounded-b-2xl bg-gradient-to-b from-[#2a2a30] to-[#151518]" />
        <div className="mx-auto h-2 w-1/3 rounded-b-md bg-[#0d0d10]" />
      </motion.div>
    </div>
  )
}
