import { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { TbBrandGithub, TbX } from 'react-icons/tb'
import type { Project } from '../../../data/projects'
import { SHELF_LABELS } from '../../../data/projects'
import { useLockBodyScroll } from '../../../hooks/useLockBodyScroll'
import { Chip } from '../../shared/Chip'
import { CtaLink } from '../../shared/CtaLink'
import { CaseStudy } from '../../shared/CaseStudy'
import { ImageSlideshow } from '../../shared/ImageSlideshow'
import { BookLoader } from './BookLoader'
import { iosSpring, iosSpringSoft } from '../../../lib/motion'

interface OpenBookProps {
  project: Project
  onClose: () => void
}

export function OpenBook({ project, onClose }: OpenBookProps) {
  const reduced = useReducedMotion() ?? false
  const [settled, setSettled] = useState(reduced)
  // Below lg the board scrolls sideways and would clip a book growing out of it, so the spread
  // just fades in there instead of morphing from its place on the shelf.
  const [morph] = useState(() => !reduced && matchMedia('(min-width: 1024px)').matches)
  const [shot, setShot] = useState(0)
  const titleId = useId()
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const previousFocusRef = useRef<Element | null>(null)

  useLockBodyScroll(true)

  useEffect(() => {
    previousFocusRef.current = document.activeElement
    const id = requestAnimationFrame(() => closeBtnRef.current?.focus())
    return () => {
      cancelAnimationFrame(id)
      const previous = previousFocusRef.current
      if (previous instanceof HTMLElement) previous.focus()
    }
  }, [])

  useEffect(() => {
    if (reduced) return
    // A fixed timer rather than onLayoutAnimationComplete: spring "settle" detection is inherently
    // fuzzy and its real-world timing varies across browsers/devices, which left the loader cover
    // visible a few hundred ms longer than intended in some engines (Firefox would briefly composite
    // a stale frame of it as a ghost). A flat delay tuned to the spring below is fully deterministic.
    const id = setTimeout(() => setSettled(true), 560)
    return () => clearTimeout(id)
  }, [reduced])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      const count = project.images.length
      if (e.key === 'ArrowRight') setShot((i) => (i + 1) % count)
      if (e.key === 'ArrowLeft') setShot((i) => (i - 1 + count) % count)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose, project.images.length])

  return (
    <motion.div
      className="fixed inset-0 z-[90] flex items-center justify-center p-0 md:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0.12 : 0.25 }}
    >
      {/* Opacity is already animated by the parent overlay; this only adds the blur. */}
      <div aria-hidden className="absolute inset-0 bg-black/60 md:backdrop-blur-sm" onClick={onClose} />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        layoutId={morph ? `book-${project.name}` : undefined}
        transition={reduced ? { duration: 0.15 } : iosSpringSoft}
        className="relative flex h-full w-full flex-col overflow-hidden bg-surface shadow-card md:h-[min(600px,86vh)] md:w-[min(920px,92vw)] md:rounded-2xl md:border md:border-border"
        style={{ perspective: 1600 }}
      >
        <button
          ref={closeBtnRef}
          type="button"
          onClick={onClose}
          aria-label="Close book"
          className="absolute right-3 top-3 z-[3] flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-ink transition-colors hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2"
        >
          <TbX size={18} />
        </button>

        <AnimatePresence>{!reduced && !settled && <BookLoader project={project} />}</AnimatePresence>

        <motion.div
          className="thin-scrollbar relative z-[1] flex h-full min-h-0 flex-col overflow-y-auto md:flex-row md:overflow-hidden"
          initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 8 }}
          animate={{ opacity: settled ? 1 : 0, y: settled ? 0 : 8 }}
          transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1], delay: settled ? 0.04 : 0 }}
        >
          <section className="thin-scrollbar p-6 md:flex-1 md:overflow-y-auto md:border-r md:border-border md:p-8">
            {project.logoSrc ? (
              <img src={project.logoSrc} alt="" className="h-12 w-12 rounded-full bg-white object-contain p-1" />
            ) : (
              <div
                aria-hidden
                className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface-raised text-xl font-semibold text-ink"
              >
                {project.name.charAt(0)}
              </div>
            )}

            <p className="mt-5 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-muted">
              {SHELF_LABELS[project.category]}
            </p>
            <h2 id={titleId} className="mt-2 text-2xl font-semibold tracking-[-0.01em] text-ink md:text-[1.75rem]">
              {project.name}
            </h2>

            {project.descriptionIsHtml ? (
              <p className="rich-text mt-3 text-muted" dangerouslySetInnerHTML={{ __html: project.description }} />
            ) : (
              <p className="mt-3 text-muted">{project.description}</p>
            )}

            {project.tech.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <Chip key={t}>
                    {t}
                  </Chip>
                ))}
              </div>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-3">
              {project.githubUrl && (
                <motion.a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit ${project.name} on GitHub`}
                  whileHover={{ scale: 1.1, rotate: -6 }}
                  whileTap={{ scale: 0.92 }}
                  transition={iosSpring}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-ink transition-colors hover:border-accent hover:text-accent"
                >
                  <TbBrandGithub size={18} />
                </motion.a>
              )}
              {project.liveUrl && <CtaLink href={project.liveUrl}>Live view</CtaLink>}
              {project.status && <Chip variant="accent">● {project.status}</Chip>}
              {project.openSource && <Chip>Open Source</Chip>}
            </div>
          </section>

          <section className="thin-scrollbar order-first border-b border-border p-4 pt-14 sm:p-6 sm:pt-14 md:order-none md:flex-[1.6] md:overflow-y-auto md:border-b-0 md:p-8">
            <div className="rounded-xl border border-border bg-surface-raised p-3 sm:p-4">
              <div
                data-cursor="zoom"
                className={
                  project.variant === 'app'
                    ? 'relative mx-auto aspect-[9/19] h-[min(60vh,560px)] overflow-hidden rounded-[2rem] border-4 border-white/10 bg-black shadow-card'
                    : 'relative aspect-video w-full overflow-hidden rounded-lg bg-black shadow-card'
                }
              >
                <ImageSlideshow
                  images={project.images}
                  alt={`${project.name} preview`}
                  fit="contain"
                  index={shot}
                  onIndexChange={setShot}
                  autoplay={false}
                  showDots={false}
                />
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-muted">
                <span className="tabular-nums">
                  {shot + 1} / {project.images.length}
                </span>
                <span>Click image to enlarge{project.images.length > 1 && ' · ← → to browse'}</span>
              </div>

              {project.images.length > 1 && (
                <div className="thin-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
                  {project.images.map((src, i) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setShot(i)}
                      aria-label={`Show screen ${i + 1}`}
                      aria-current={i === shot}
                      className={`shrink-0 overflow-hidden rounded-md border-2 bg-black transition-all ${
                        project.variant === 'app' ? 'aspect-[9/19] w-12' : 'aspect-video w-24'
                      } ${i === shot ? 'border-accent opacity-100' : 'border-transparent opacity-50 hover:opacity-90'}`}
                    >
                      <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {project.caseStudy ? (
              // Held until the book has opened, or the stagger would play under the loader cover.
              <CaseStudy caseStudy={project.caseStudy} delay={0.6} className="mt-6" />
            ) : (
              <p className="mt-6 text-sm italic text-muted">No case study written up for this one yet.</p>
            )}
          </section>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
