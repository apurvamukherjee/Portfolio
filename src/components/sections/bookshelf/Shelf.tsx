import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Project, ShelfCategory } from '../../../data/projects'
import { SHELF_LABELS, SHELF_SLUGS } from '../../../data/projects'
import { fadeUp, staggerContainer, viewportOnce, withMotionPreference } from '../../../lib/motion'
import { usesTech } from '../../../lib/tech'
import { Book } from './Book'
import { bookSize } from './geometry'
import { ShelfOrnaments } from './ShelfOrnament'

export interface ShelfGroup {
  category: ShelfCategory
  projects: Project[]
}

interface ShelfProps {
  groups: ShelfGroup[]
  /** Tech the section is filtered to; books without it are pushed back. */
  tech: string | null
  openId: string | null
  reduced: boolean
  onOpen: (name: string) => void
}

const BOOKS_H = 244
const PLATE_H = 28

/** The board: a lit front edge with the label plates on it, and the shadow it throws below. */
const BOARD_STYLE = {
  height: PLATE_H,
  backgroundImage:
    'linear-gradient(180deg, color-mix(in srgb, var(--color-ink) 22%, transparent) 0 1px, color-mix(in srgb, var(--color-ink) 9%, transparent) 1px, color-mix(in srgb, var(--color-ink) 4%, transparent) 100%)',
  boxShadow: '0 16px 24px -14px rgba(0,0,0,0.55)',
}

/** A strip light under the board above, washing down the wall behind the books. */
const BACKLIGHT_STYLE = {
  background:
    'radial-gradient(60% 100% at 50% 0%, color-mix(in srgb, var(--color-accent) 16%, transparent), transparent 75%)',
}

/** Pool of light under the book whose cover is turned out. */
const GLOW_STYLE = {
  background:
    'radial-gradient(50% 50% at 50% 60%, color-mix(in srgb, var(--color-accent) 55%, transparent), transparent 75%)',
}

/**
 * One board of the bookcase, holding a few category groups side by side. Exactly one book on
 * the board has its cover turned out at any time, so the row never changes width as the
 * visitor moves along it: the next book opens as the last one closes.
 */
export function Shelf({ groups, tech, openId, reduced, onOpen }: ShelfProps) {
  const books = groups.flatMap((g) => g.projects)
  const [picked, setPicked] = useState(books[0]?.name)
  // With a filter on, a cover that doesn't match gives way to the first book that does.
  const pickedMatches = books.some((p) => p.name === picked && usesTech(p, tech))
  const active = pickedMatches ? picked : (books.find((p) => usesTech(p, tech))?.name ?? picked)

  const bookVariant = withMotionPreference(fadeUp, reduced)

  return (
    <motion.div
      className="relative"
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerContainer(0.04)}
    >
      <span aria-hidden className="pointer-events-none absolute inset-x-8 top-0 h-32" style={BACKLIGHT_STYLE} />

      {/* Narrow screens scroll the board sideways rather than wrap it: a wrapped row would
          reflow every time the turned-out cover moved between lines. */}
      <div className="thin-scrollbar pt-5 max-lg:overflow-x-auto max-lg:overflow-y-hidden">
        <div className="relative flex w-max min-w-full items-end gap-6 px-4 md:px-6">
          <span aria-hidden className="absolute inset-x-0 bottom-0 rounded-[3px]" style={BOARD_STYLE} />

          {groups.map((group) => (
            <section key={group.category} aria-label={SHELF_LABELS[group.category]} className="relative flex flex-none flex-col">
              <ul className="flex list-none items-end gap-[3px]" style={{ height: BOOKS_H }}>
                {group.projects.map((project) => {
                  const open = project.name === active
                  const { width, height, openWidth } = bookSize(project.name)
                  return (
                    <motion.li
                      key={project.name}
                      variants={bookVariant}
                      style={{ width: open ? openWidth : width, height }}
                      className={`relative flex-none ${open ? 'z-[2]' : ''} ${
                        reduced ? '' : 'transition-[width] duration-[520ms] ease-[cubic-bezier(0.32,0.72,0,1)]'
                      }`}
                    >
                      <span
                        aria-hidden
                        className={`pointer-events-none absolute inset-x-[-14px] bottom-[-10px] top-[30%] blur-[18px] transition-opacity duration-500 ${
                          open ? 'opacity-100' : 'opacity-0'
                        }`}
                        style={GLOW_STYLE}
                      />
                      <Book
                        project={project}
                        open={open}
                        dimmed={!usesTech(project, tech)}
                        hidden={project.name === openId}
                        reduced={reduced}
                        onActivate={() => setPicked(project.name)}
                        onOpen={() => onOpen(project.name)}
                      />
                    </motion.li>
                  )
                })}
              </ul>

              <p
                title={SHELF_LABELS[group.category]}
                className="relative flex items-center gap-1.5 whitespace-nowrap font-mono text-[0.65rem] text-muted"
                style={{ height: PLATE_H }}
              >
                <span>
                  <span className="text-accent">~/</span>
                  {SHELF_SLUGS[group.category]}
                </span>
                <span className="tabular-nums text-muted/50">{String(group.projects.length).padStart(2, '0')}</span>
              </p>
            </section>
          ))}

          <div className="relative ml-auto flex flex-none items-end gap-1" style={{ paddingBottom: PLATE_H }}>
            <ShelfOrnaments category={groups[0].category} />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
