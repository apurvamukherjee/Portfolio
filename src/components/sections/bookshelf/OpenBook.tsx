import { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { TbBrandGithub, TbX } from 'react-icons/tb'
import type { Project } from '../../../data/projects'
import { SHELF_LABELS } from '../../../data/projects'
import { BADGE_BG, CAT_GRADIENT, PLACEHOLDER_BG } from '../../../lib/projectStyles'
import { useLockBodyScroll } from '../../../hooks/useLockBodyScroll'
import { useReducedMotion } from '../../../hooks/useReducedMotion'
import { Chip } from '../../shared/Chip'
import { CtaLink } from '../../shared/CtaLink'
import { ImageSlideshow } from '../../shared/ImageSlideshow'
import { MacBookFrame } from '../../shared/MacBookFrame'
import { BookLoader } from './BookLoader'

interface OpenBookProps {
  project: Project
  onClose: () => void
}

export function OpenBook({ project, onClose }: OpenBookProps) {
  const reduced = useReducedMotion()
  const [settled, setSettled] = useState(reduced)
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
    const id = setTimeout(() => setSettled(true), 520)
    return () => clearTimeout(id)
  }, [reduced])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <motion.div
      className="fixed inset-0 z-[90] flex items-center justify-center p-0 md:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0.12 : 0.25 }}
    >
      <div aria-hidden className="absolute inset-0 bg-black/60" onClick={onClose} />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        layoutId={reduced ? undefined : `book-${project.name}`}
        transition={reduced ? { duration: 0.15 } : { type: 'spring', stiffness: 300, damping: 32 }}
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
          initial={{ opacity: reduced ? 1 : 0 }}
          animate={{ opacity: settled ? 1 : 0 }}
          transition={{ duration: 0.28, delay: settled ? 0.05 : 0 }}
        >
          <section className="thin-scrollbar flex-1 overflow-y-auto border-b border-border p-6 pt-14 md:border-b-0 md:border-r md:p-8 md:pt-8">
            {project.kind === 'placeholder' ? (
              <div
                aria-hidden
                className={`flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold text-white ${BADGE_BG[project.accent]}`}
              >
                {project.badge}
              </div>
            ) : project.logoSrc ? (
              <img src={project.logoSrc} alt="" className="h-12 w-12 rounded-full bg-white object-contain p-1" />
            ) : (
              <div
                aria-hidden
                className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br text-xl font-bold text-white ${CAT_GRADIENT[project.category]}`}
              >
                {project.name.charAt(0)}
              </div>
            )}

            <p className="mt-4 text-xs font-bold uppercase tracking-wider text-accent">{SHELF_LABELS[project.category]}</p>
            <h2 id={titleId} className="mt-1 text-2xl font-bold text-ink md:text-3xl">
              {project.name}
            </h2>

            {project.descriptionIsHtml ? (
              <p className="mt-3 text-muted" dangerouslySetInnerHTML={{ __html: project.description }} />
            ) : (
              <p className="mt-3 text-muted">{project.description}</p>
            )}

            {project.tech.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <Chip key={t} variant="tech">
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
                  transition={{ type: 'spring', stiffness: 350, damping: 18 }}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-ink transition-colors hover:border-accent hover:text-accent"
                >
                  <TbBrandGithub size={18} />
                </motion.a>
              )}
              {project.liveUrl && <CtaLink href={project.liveUrl}>Live view</CtaLink>}
              {project.status && <Chip variant="accent">● {project.status}</Chip>}
            </div>
          </section>

          <section className="thin-scrollbar flex-1 overflow-y-auto p-6 md:p-8">
            {project.kind === 'gallery' ? (
              <>
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted">Screens</p>
                {project.variant === 'app' ? (
                  <div className="relative mx-auto aspect-[9/19] w-40 overflow-hidden rounded-[1.75rem] border-4 border-white/10 bg-black shadow-card sm:w-48">
                    <ImageSlideshow images={project.images} alt={`${project.name} preview`} fit="contain" />
                  </div>
                ) : (
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg shadow-card">
                    <MacBookFrame>
                      <ImageSlideshow images={project.images} alt={`${project.name} preview`} fit="cover" />
                    </MacBookFrame>
                  </div>
                )}

                {project.caseStudy ? (
                  <div className="mt-6 flex flex-col gap-3 text-sm text-muted">
                    <p>
                      <span className="font-semibold text-ink">Problem — </span>
                      {project.caseStudy.problem}
                    </p>
                    <p>
                      <span className="font-semibold text-ink">Approach — </span>
                      {project.caseStudy.approach}
                    </p>
                    <p>
                      <span className="font-semibold text-ink">Impact — </span>
                      {project.caseStudy.impact}
                    </p>
                  </div>
                ) : (
                  <p className="mt-6 text-sm italic text-muted">No case study written up for this one yet.</p>
                )}
              </>
            ) : (
              <div
                className={`flex min-h-[220px] items-center justify-center rounded-lg bg-gradient-to-br p-6 text-center text-sm text-white/80 ${PLACEHOLDER_BG[project.accent]} to-black`}
              >
                {project.placeholderText}
              </div>
            )}
          </section>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
