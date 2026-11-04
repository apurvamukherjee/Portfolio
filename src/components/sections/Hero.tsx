import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { TbArrowRight, TbBrandGithub, TbBrandLinkedin, TbMail } from "react-icons/tb";
import { jumpToSection } from "../../lib/sectionTransition";
import { site } from "../../data/site";
import { socialLinks } from "../../data/social";
import { experience } from "../../data/experience";
import { HeroIllustration } from "./HeroIllustration";
import {
  fadeUp,
  fadeIn,
  staggerContainer,
  withMotionPreference,
} from "../../lib/motion";
import { useIntro } from "../../hooks/useIntro";

const IST = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Asia/Kolkata",
});

function useIstClock(): string {
  const [time, setTime] = useState(() => IST.format(new Date()));
  useEffect(() => {
    const id = setInterval(() => setTime(IST.format(new Date())), 15_000);
    return () => clearInterval(id);
  }, []);
  return time;
}

const currentRole = experience.roles.find((r) => r.status === "Current")?.role ?? "Software Engineer";
const linkFor = (icon: string) => socialLinks.find((l) => l.icon === icon)?.href ?? "#";
const SOCIALS = [
  { label: "GitHub", href: linkFor("github"), Icon: TbBrandGithub },
  { label: "LinkedIn", href: linkFor("linkedin"), Icon: TbBrandLinkedin },
] as const;
const MAIL = linkFor("mail");

export function Hero() {
  const reduced = useReducedMotion();
  const introDone = useIntro();
  const item = withMotionPreference(fadeUp, reduced);
  const time = useIstClock();

  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] w-full items-center justify-center px-6 pb-20 pt-32 sm:px-8 md:px-12 lg:px-16 notch:pt-40"
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-14 lg:grid-cols-[1.08fr_1fr] lg:gap-12">
        <motion.div
          className="flex w-full min-w-0 flex-col items-start"
          initial="hidden"
          animate={introDone ? "visible" : "hidden"}
          variants={staggerContainer(0.1)}
        >
          <motion.a
            variants={item}
            href={experience.siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full border border-border bg-surface-raised py-1.5 pl-2.5 pr-3.5 text-xs font-medium text-muted transition-colors hover:border-accent/50 hover:text-ink"
          >
            <span aria-hidden className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#28c840] opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#28c840]" />
            </span>
            {currentRole} at <span className="text-ink">{experience.name}</span>
            <TbArrowRight aria-hidden className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </motion.a>

          <motion.p variants={item} className="mt-8 font-mono text-sm text-accent md:text-base">
            {site.greeting}
          </motion.p>

          <motion.h1
            variants={item}
            className="mt-2 text-[clamp(2.6rem,9vw,4.25rem)] font-extrabold leading-[1.02] tracking-[-0.035em] text-ink [text-wrap:balance] lg:text-[clamp(3rem,4.6vw,4.25rem)]"
          >
            {site.name}
            <span className="text-accent">.</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-[34rem] text-lg leading-relaxed text-muted md:text-xl"
          >
            <span className="font-medium text-ink">Full-stack engineer</span> in Kolkata. I design and
            build production-grade web &amp; mobile apps with React, React Native and Node.js
            — end to end, from system design to deployment.
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#projects"
              onClick={(e) => {
                if (jumpToSection("projects")) e.preventDefault();
              }}
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-accent px-5 sm:px-6 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_var(--color-accent)] transition-[transform,box-shadow,background-color] hover:-translate-y-0.5 hover:shadow-[0_14px_34px_-10px_var(--color-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:translate-y-0"
            >
              View my work
              <TbArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href={MAIL}
              className="inline-flex h-12 items-center gap-2 rounded-full border border-border bg-surface-raised px-5 sm:px-6 text-sm font-semibold text-ink transition-colors hover:border-ink/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <TbMail aria-hidden className="h-4 w-4" />
              Get in touch
            </a>

            <span aria-hidden className="mx-1 hidden h-6 w-px bg-border sm:block" />

            <ul className="hidden items-center gap-1 sm:flex">
              {SOCIALS.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-11 w-11 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-raised hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.dl
            variants={item}
            className="mt-12 grid w-full max-w-[34rem] grid-cols-3 gap-4 border-t border-border pt-6"
          >
            {[
              { k: "Based in", v: "Kolkata, IN", sub: `${time} IST` },
              { k: "Education", v: "Computer Sci.", sub: "KIIT · '26" },
              { k: "Focus", v: "Full-stack", sub: "Web · Mobile" },
            ].map(({ k, v, sub }) => (
              <div key={k} className="min-w-0">
                <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted sm:text-[11px]">{k}</dt>
                <dd className="mt-1.5 truncate text-sm font-semibold text-ink sm:text-base">{v}</dd>
                <dd className="truncate font-mono text-[11px] text-muted sm:text-xs">{sub}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={introDone ? "visible" : "hidden"}
          variants={withMotionPreference(fadeIn, reduced)}
          transition={{ delay: 0.35 }}
          className="relative w-full min-w-0"
        >
          <div className="hero-recede">
            <HeroIllustration />
          </div>
        </motion.div>
      </div>

      <motion.a
        href="#about"
        aria-label="Scroll to About"
        onClick={(e) => {
          if (jumpToSection("about")) e.preventDefault();
        }}
        initial={{ opacity: 0 }}
        animate={introDone ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-muted transition-colors hover:text-accent lg:flex"
      >
        <span className="flex h-8 w-5 justify-center rounded-full border border-current pt-1.5">
          <motion.span
            className="h-1.5 w-1 rounded-full bg-current"
            animate={reduced ? undefined : { y: [0, 10, 0], opacity: [1, 0.2, 1] }}
            transition={reduced ? undefined : { duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.a>
    </section>
  );
}
