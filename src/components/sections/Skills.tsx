import type { PointerEvent } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { skillCategories } from '../../data/skills'
import { SectionHeading } from '../shared/SectionHeading'
import { GradientSweepCard } from '../shared/GradientSweepCard'
import { fadeUp, staggerContainer, viewportOnce, withMotionPreference } from '../../lib/motion'

const SPOTLIGHT_STYLE = {
  background:
    'radial-gradient(180px circle at var(--spot-x, 50%) var(--spot-y, 50%), color-mix(in srgb, var(--color-accent) 16%, transparent), transparent 70%)',
}

// Writes CSS vars straight to the DOM so following the cursor never re-renders React.
function trackSpotlight(e: PointerEvent<HTMLDivElement>) {
  if (e.pointerType !== 'mouse') return
  const el = e.currentTarget
  const rect = el.getBoundingClientRect()
  el.style.setProperty('--spot-x', `${e.clientX - rect.left}px`)
  el.style.setProperty('--spot-y', `${e.clientY - rect.top}px`)
}

export function Skills() {
  const reduced = useReducedMotion()

  return (
    <section id="skills" className="w-full px-6 py-24 md:px-16">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4">
        <SectionHeading tag="Skills" />

        <div className="mt-8 flex w-full flex-col gap-16">
          {skillCategories.map((category) => (
            <div key={category.heading}>
              <h3 className="text-gradient-accent mb-8 text-center text-2xl font-black tracking-widest md:text-3xl">
                {category.heading}
              </h3>
              <motion.div
                className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4"
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
                variants={staggerContainer(0.05)}
              >
                {category.skills.map(({ name, icon: Icon }) => (
                  <motion.div
                    key={name}
                    variants={withMotionPreference(fadeUp, reduced)}
                    onPointerMove={reduced ? undefined : trackSpotlight}
                  >
                    <GradientSweepCard className="flex h-full flex-col items-center justify-center gap-3 rounded-xl px-4 py-6 text-center">
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        style={SPOTLIGHT_STYLE}
                      />
                      <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white/5 text-muted transition-all duration-300 group-hover:scale-110 group-hover:bg-accent/15 group-hover:text-accent">
                        <Icon size={22} />
                      </span>
                      <span className="relative text-sm font-semibold text-ink">{name}</span>
                    </GradientSweepCard>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
