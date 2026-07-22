import { TbBrandGithub } from 'react-icons/tb'
import type { Project } from '../../data/projects'
import { GradientSweepCard } from '../shared/GradientSweepCard'
import { ImageSlideshow } from '../shared/ImageSlideshow'
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
        <p className="text-muted">{project.description}</p>

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
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${project.name} on GitHub`}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-ink transition-colors hover:border-accent hover:text-accent"
            >
              <TbBrandGithub size={18} />
            </a>
          )}
          {project.liveUrl && <CtaLink href={project.liveUrl}>Live view</CtaLink>}
          {project.status && <Chip variant="accent">● {project.status}</Chip>}
        </div>
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
          <ImageSlideshow images={project.images} alt={`${project.name} preview`} fit="cover" />
        </div>
      )}
    </GradientSweepCard>
  )
}
