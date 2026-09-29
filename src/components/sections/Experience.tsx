import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll, useSpring, useReducedMotion, useTransform } from 'framer-motion'
import { experience } from '../../data/experience'
import { SectionHeading } from '../shared/SectionHeading'
import { GradientSweepCard } from '../shared/GradientSweepCard'
import { Chip } from '../shared/Chip'
import { ExperienceNode } from './ExperienceNode'
import { fadeUp, staggerContainer, viewportOnce, withMotionPreference } from '../../lib/motion'

// Matches the track's inset: it runs from the first dot's centre to the last one's.
const TRACK_INSET = 22

/** Sum of offsetTops up to `ancestor` — unlike getBoundingClientRect, ignores the entrance transforms. */
function offsetTopWithin(node: HTMLElement, ancestor: HTMLElement): number {
  let top = 0
  let current: HTMLElement | null = node
  while (current && current !== ancestor) {
    top += current.offsetTop
    current = current.offsetParent instanceof HTMLElement ? current.offsetParent : null
  }
  return top
}

export function Experience() {
  const reduced = useReducedMotion()
  const timelineRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: timelineRef, offset: ['start 0.8', 'end 0.3'] })
  const progress = useSpring(scrollYProgress, { stiffness: 300, damping: 40, restDelta: 0.001 })
  const [reachedCount, setReachedCount] = useState(0)
  // Where each dot sits along the track (0–1). Measured lazily, dropped whenever the timeline resizes.
  const stopsRef = useRef<number[] | null>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const trackHeightRef = useRef(0)
  // Glowing head riding the tip of the line: a translate on its own layer, so scrolling never repaints it.
  const headY = useTransform(progress, (v) => v * trackHeightRef.current)
  const headOpacity = useTransform(progress, [0, 0.02, 0.97, 1], [0, 1, 1, 0])

  function syncReached(value: number) {
    const timeline = timelineRef.current
    if (!timeline) return
    if (!stopsRef.current) {
      const track = timeline.offsetHeight - TRACK_INSET * 2
      const dots = timeline.querySelectorAll<HTMLElement>('[data-timeline-dot]')
      stopsRef.current = Array.from(dots, (dot) => offsetTopWithin(dot, timeline) / track)
    }
    setReachedCount(stopsRef.current.filter((stop) => value > stop).length)
  }

  useMotionValueEvent(progress, 'change', syncReached)

  useEffect(() => {
    const timeline = timelineRef.current
    if (!timeline) return
    const observer = new ResizeObserver(() => {
      stopsRef.current = null
      trackHeightRef.current = trackRef.current?.offsetHeight ?? 0
    })
    observer.observe(timeline)
    // A reload mid-page lands with progress already set, and no change event would fire for it.
    syncReached(progress.get())
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section id="experience" className="w-full px-6 py-24 md:px-16">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-4">
        <SectionHeading tag="Experience" />

        <motion.div
          className="mt-8 w-full"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={withMotionPreference(fadeUp, reduced)}
        >
          <GradientSweepCard tilt={false} className="flex flex-col gap-6 rounded-lg p-6 md:p-10">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-2xl font-bold text-ink md:text-3xl">{experience.name}</h3>
              <a
                href={experience.siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-accent hover:underline"
              >
                {experience.site}
              </a>
              <Chip className="ml-auto">
                {experience.duration}
              </Chip>
            </div>

            <p className="text-muted">{experience.subtitle}</p>

            <motion.div
              ref={timelineRef}
              className="relative flex flex-col gap-10"
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={staggerContainer(0.15)}
            >
              <div
                ref={trackRef}
                aria-hidden
                className="absolute bottom-[22px] left-[22px] top-[22px] w-0.5 overflow-hidden rounded-full bg-border"
              >
                <motion.div
                  className="w-full origin-top bg-gradient-to-b from-accent to-accent-deep"
                  style={{ height: '100%', scaleY: reduced ? 1 : progress }}
                />
              </div>
              {!reduced && (
                // Sits under the dots (z-5 vs z-10), so each checkpoint swallows it as it passes.
                <motion.span
                  aria-hidden
                  data-timeline-head
                  className="pointer-events-none absolute left-[23px] top-[22px] z-[5] h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_16px_5px_color-mix(in_srgb,var(--color-accent)_55%,transparent)] will-change-transform"
                  style={{ y: headY, opacity: headOpacity }}
                />
              )}

              {experience.roles.map((role, i) => (
                <motion.div key={role.role} variants={withMotionPreference(fadeUp, reduced)}>
                  <ExperienceNode {...role} reached={reduced || i < reachedCount} />
                </motion.div>
              ))}
            </motion.div>
          </GradientSweepCard>
        </motion.div>
      </div>
    </section>
  )
}
