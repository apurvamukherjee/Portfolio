import type { CSSProperties, ReactNode } from 'react'
import type { IconType } from 'react-icons'
import { motion, useReducedMotion } from 'framer-motion'
import { TbAlertTriangle, TbBulb, TbTrendingUp } from 'react-icons/tb'
import type { CaseStudy as CaseStudyData } from '../../data/projects'
import { fadeUp, staggerContainer, withMotionPreference } from '../../lib/motion'

interface Section {
  key: keyof CaseStudyData
  label: string
  Icon: IconType
  color: string
}

// The KPI tokens are theme-aware (brighter in dark, deeper in light), so the three beats stay legible in both.
const SECTIONS: Section[] = [
  { key: 'problem', label: 'Problem', Icon: TbAlertTriangle, color: 'var(--color-kpi-days)' },
  { key: 'approach', label: 'Approach', Icon: TbBulb, color: 'var(--color-kpi-repos)' },
  { key: 'impact', label: 'Impact', Icon: TbTrendingUp, color: 'var(--color-kpi-solved)' },
]

// A figure like "99", "0.0%", "2-8" or "1,000" that starts a word. The leading group stands in for a
// lookbehind, which older Safari can't parse (a syntax error there would take down the whole bundle).
const METRIC = /(^|[\s(])(\d(?:[\d,.]*\d)?(?:[-–]\d(?:[\d,.]*\d)?)?(?:\s?(?:%|ms|KB|MB|GB))?)/g
// "Swift 6", "Gemini 1.5": a number right after a product name is a version, not a result.
const VERSIONED = /\b(?:Swift|Gemini|React|Svelte|Node|iOS|macOS|HTTP|TLS)$/

/** Wraps the numbers in a case-study line so the measurable claims stand out. */
function highlightMetrics(text: string): ReactNode[] {
  // split() with two capture groups yields [text, lead, metric, text, lead, metric, ..., text].
  const parts = text.split(METRIC)
  return parts.map((part, i) =>
    i % 3 === 2 && !VERSIONED.test(parts[i - 2] ?? '') ? (
      <span
        key={i}
        className="font-semibold text-[var(--cs)] [text-shadow:0_0_10px_color-mix(in_srgb,var(--cs)_45%,transparent)]"
      >
        {part}
      </span>
    ) : (
      part
    ),
  )
}

interface CaseStudyProps {
  caseStudy: CaseStudyData
  /** Seconds to hold the stagger, e.g. while a parent dialog finishes opening. */
  delay?: number
  className?: string
}

/** Problem → Approach → Impact as three colour-coded, glowing beats that stagger in. */
export function CaseStudy({ caseStudy, delay = 0, className = '' }: CaseStudyProps) {
  const reduced = useReducedMotion()
  const item = withMotionPreference(fadeUp, reduced)

  return (
    <motion.dl
      className={`flex flex-col gap-3 ${className}`}
      initial="hidden"
      animate="visible"
      variants={staggerContainer(0.12, reduced ? 0 : delay)}
    >
      {SECTIONS.map(({ key, label, Icon, color }) => (
        <motion.div
          key={key}
          variants={item}
          style={{ '--cs': color } as CSSProperties}
          className="relative overflow-hidden rounded-xl border border-[color-mix(in_srgb,var(--cs)_28%,transparent)] bg-[color-mix(in_srgb,var(--cs)_7%,transparent)] py-3.5 pl-5 pr-4 transition-[box-shadow,border-color] duration-300 hover:border-[color-mix(in_srgb,var(--cs)_55%,transparent)] hover:shadow-[0_0_28px_-8px_var(--cs)]"
        >
          <span aria-hidden className="absolute inset-y-0 left-0 w-1 bg-[var(--cs)] shadow-[0_0_12px_var(--cs)]" />
          <dt className="mb-1.5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--cs)] [text-shadow:0_0_14px_color-mix(in_srgb,var(--cs)_60%,transparent)]">
            <Icon size={16} aria-hidden />
            {label}
          </dt>
          <dd className="text-sm leading-relaxed text-muted">{highlightMetrics(caseStudy[key])}</dd>
        </motion.div>
      ))}
    </motion.dl>
  )
}
