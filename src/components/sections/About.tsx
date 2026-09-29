import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SectionHeading } from "../shared/SectionHeading";
import { GithubStats } from "./GithubStats";
import {
  fadeUp,
  fadeDown,
  staggerContainer,
  viewportOnce,
  withMotionPreference,
  appleEase,
} from "../../lib/motion";

// Seconds between one phrase's shine and the next. The CSS cycle is 6s, so up to ~8 phrases fit
// with a pause before the band starts over at the first one.
const FLOW_STEP_S = 0.6;
const UNDERLINE_DRAWN = { backgroundSize: "100% 2px" };

interface HighlightProps {
  /** Reading-order position across the whole section; sets when the shine and underline reach it. */
  order: number;
  children: ReactNode;
}

/**
 * A key phrase: accent text with a light band that flows through the phrases in reading order,
 * and an underline that draws in (line by line when it wraps) as the section appears.
 */
function Highlight({ order, children }: HighlightProps) {
  const reduced = useReducedMotion();

  return (
    // Its own in-view trigger, not the section's: that one fires 200px early, so the draw would
    // mostly finish below the fold where nobody sees it.
    <motion.span
      initial={reduced ? UNDERLINE_DRAWN : { backgroundSize: "0% 2px" }}
      whileInView={UNDERLINE_DRAWN}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.6, ease: appleEase, delay: 0.2 + order * 0.12 }}
      className="highlight-underline"
    >
      <span
        className="highlight-flow"
        style={{ animationDelay: `${order * FLOW_STEP_S}s` }}
      >
        {children}
      </span>
    </motion.span>
  );
}

export function About() {
  const reduced = useReducedMotion();

  return (
    <section id="about" className="w-full px-6 py-24 md:px-16">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4">
        <SectionHeading tag="AboutMe" />

        <motion.div
          className="mt-8 flex w-full flex-col items-center gap-12 md:flex-row md:items-start"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer(0.15)}
        >
          <motion.div
            variants={withMotionPreference(fadeUp, reduced)}
            className="flex flex-col gap-5 md:w-3/5"
          >
            <p className="text-lg leading-relaxed text-ink md:text-xl">
              I'm Apurva, a <Highlight order={0}>software engineer</Highlight>{" "}
              in Kolkata who likes owning a feature from the{" "}
              <Highlight order={1}>first sketch to the final deploy</Highlight>.
              I started poking at code at KIIT University in 2022 and never
              really stopped. These days I design the systems, write the APIs
              behind them, and build the web and mobile screens people actually
              tap on. Somewhere along the way that added up to live production
              apps and more than{" "}
              <Highlight order={2}>50 reusable React components</Highlight>.
            </p>
            <p className="text-lg leading-relaxed text-muted md:text-xl">
              I took the scenic route here. I started as a UI/UX intern, spent
              a stint in the Founder's Office running client calls and sprints,
              then moved into engineering as an intern. Since August 2026 I've
              been a{" "}
              <Highlight order={3}>full-time Software Engineer</Highlight> at
              Mind Webs Venture, shipping with React, React Native, Node.js and
              MongoDB. I've pitched our product for four days straight at{" "}
              <Highlight order={4}>India Mobile Congress 2025</Highlight> in
              Delhi and judged student teams at{" "}
              <Highlight order={5}>DriveBlaze Hackathon</Highlight>. After hours
              I build things like a multiplayer Monopoly for up to eight friends
              and a Mac app that turns the{" "}
              <Highlight order={6}>MacBook notch</Highlight> into a music player.
            </p>
          </motion.div>

          <motion.div
            variants={withMotionPreference(fadeDown, reduced)}
            className="group relative w-full max-w-xs flex-shrink-0 md:w-2/5"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute -inset-2 border-l-2 border-t-2 border-accent transition-transform duration-500 group-hover:-translate-x-3 group-hover:-translate-y-3"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute -inset-2 border-b-2 border-r-2 border-accent transition-transform duration-500 group-hover:translate-x-3 group-hover:translate-y-3"
            />
            <img
              src="/assets/img/me.jpeg"
              alt="Apurva Mukherjee"
              className="relative w-full object-cover"
            />
          </motion.div>
        </motion.div>

        <GithubStats />
      </div>
    </section>
  );
}
