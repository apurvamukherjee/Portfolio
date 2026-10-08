import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SectionHeading } from "../shared/SectionHeading";
import { jumpToSection } from "../../lib/sectionTransition";
import { openNotch } from "../layout/visor-notch/openNotch";
import { GithubStats } from "./GithubStats";
import { PortraitFrame } from "./PortraitFrame";
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
  /** Section id the phrase links to. */
  to: string;
  /** Runs instead of the section jump. */
  action?: () => void;
  children: ReactNode;
}

/**
 * A key phrase: accent text with a light band that flows through the phrases in reading order,
 * and an underline that draws in (line by line when it wraps) as the section appears.
 */
function Highlight({ order, to, action, children }: HighlightProps) {
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
        <a
          href={`#${to}`}
          onClick={(e) => {
            if (action) {
              e.preventDefault();
              action();
            } else if (jumpToSection(to)) e.preventDefault();
          }}
          className="rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {children}
        </a>
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
              CSE, KIIT '26. <Highlight order={0} to="skills">Software engineer</Highlight>{" "}
              in Kolkata building for the web, with{" "}
              <Highlight order={1} to="projects">clean architecture</Highlight> and code that
              doesn't break. I own features end to end: system design, APIs,
              React and React Native UI. Shipped live production apps and{" "}
              <Highlight order={2} to="projects">50+ reusable React components</Highlight>.
            </p>
            <p className="text-lg leading-relaxed text-muted md:text-xl">
              <Highlight order={3} to="experience">Full-time SWE at Mind Webs Venture</Highlight>{" "}
              since Aug 2026: React, React Native, Node.js, MongoDB. Path: UI/UX
              intern, Founder's Office, engineering intern. Pitched at{" "}
              <Highlight order={4} to="leadership">India Mobile Congress 2025</Highlight>, judged{" "}
              <Highlight order={5} to="leadership">DriveBlaze Hackathon</Highlight>. Side
              projects: 8-player multiplayer Monopoly, and a macOS app that
              turns the <Highlight order={6} to="home" action={openNotch}>MacBook notch</Highlight> into a
              music player.
            </p>
          </motion.div>

          <motion.div
            variants={withMotionPreference(fadeDown, reduced)}
            className="relative w-full max-w-xs flex-shrink-0 md:w-2/5"
          >
            <PortraitFrame src="/assets/img/graduation.jpeg" alt="Apurva Mukherjee at his KIIT graduation" />
          </motion.div>
        </motion.div>

        <GithubStats />
      </div>
    </section>
  );
}
