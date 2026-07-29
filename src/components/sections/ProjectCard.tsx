import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { TbBrandGithub, TbChevronDown } from 'react-icons/tb'
import type { Project } from '../../data/projects'
import { GradientSweepCard } from '../shared/GradientSweepCard'
import { ImageSlideshow } from '../shared/ImageSlideshow'
import { MacBookFrame } from '../shared/MacBookFrame'
import { CtaLink } from '../shared/CtaLink'
import { Chip } from '../shared/Chip'

const BADGE_BG: Record<'red' | 'blue' | 'violet', string> = {
  red: 'bg-red-600',
  blue: 'bg-blue-600',
  violet: 'bg-violet-600',
}

const PLACEHOLDER_BG: Record<'red' | 'blue' | 'violet', string> = {
  red: 'from-red-950',
  blue: 'from-blue-950',
  violet: 'from-violet-950',
}

export function ProjectCard(project: Project) {
  const [caseStudyOpen, setCaseStudyOpen] = useState(false)
  const caseStudy = project.kind === 'gallery' ? project.caseStudy : undefined

  return (
    <GradientSweepCard className="flex flex-col overflow-hidden rounded-lg md:flex-row">
      <div className="flex flex-1 flex-col gap-4 p-6 md:p-8">
        {project.kind === 'placeholder' ? (
          <div
            aria-hidden
            className={`flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold text-white ${BADGE_BG[project.accent]}`}
          >
            {project.badge}
          </div>
        ) : project.logoSrc ? (
          <img
            src={project.logoSrc}
            alt={`${project.name} logo`}
            className="h-12 w-12 rounded-full bg-white object-contain p-1"
          />
        ) : (
          <div
            aria-hidden
            className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-deep text-xl font-bold text-white"
          >
            {project.name.charAt(0)}
          </div>
        )}

        <h3 className="text-2xl font-bold text-ink md:text-3xl">{project.name}</h3>
        {project.descriptionIsHtml ? (
          <p className="text-muted" dangerouslySetInnerHTML={{ __html: project.description }} />
        ) : (
          <p className="text-muted">{project.description}</p>
        )}

        {project.tech.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <Chip key={t} variant="tech">
                {t}
              </Chip>
            ))}
          </div>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-3 pt-2">
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
          {caseStudy && (
            <button
              type="button"
              aria-expanded={caseStudyOpen}
              onClick={() => setCaseStudyOpen((o) => !o)}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-accent hover:text-accent"
            >
              View case study
              <TbChevronDown className={`transition-transform duration-300 ${caseStudyOpen ? 'rotate-180' : ''}`} />
            </button>
          )}
          {project.status && <Chip variant="accent">● {project.status}</Chip>}
        </div>

        <AnimatePresence initial={false}>
          {caseStudyOpen && caseStudy && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4 text-sm text-muted">
                <p>
                  <span className="font-semibold text-ink">Problem — </span>
                  {caseStudy.problem}
                </p>
                <p>
                  <span className="font-semibold text-ink">Approach — </span>
                  {caseStudy.approach}
                </p>
                <p>
                  <span className="font-semibold text-ink">Impact — </span>
                  {caseStudy.impact}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {project.kind === 'placeholder' ? (
        <div
          className={`relative min-h-[220px] flex-1 overflow-hidden bg-gradient-to-br ${PLACEHOLDER_BG[project.accent]} to-black`}
        >
          <div className="flex h-full w-full items-center justify-center p-6 text-center text-sm text-white/80">
            {project.placeholderText}
          </div>
        </div>
      ) : project.variant === 'app' ? (
        <div className="relative flex flex-none items-center justify-center overflow-hidden bg-black p-6 md:w-72">
          <div className="relative aspect-[9/19] w-40 overflow-hidden rounded-[1.75rem] border-4 border-white/10 sm:w-44">
            <ImageSlideshow images={project.images} alt={`${project.name} preview`} fit="contain" />
          </div>
        </div>
      ) : (
        <div className="relative min-h-[260px] flex-1 overflow-hidden">
          <MacBookFrame>
            <ImageSlideshow images={project.images} alt={`${project.name} preview`} fit="cover" />
          </MacBookFrame>
        </div>
      )}
    </GradientSweepCard>
  )
}
