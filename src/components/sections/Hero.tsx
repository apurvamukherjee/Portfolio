import { useState } from "react";
import { motion } from "framer-motion";
import { TbArrowDown } from "react-icons/tb";
import { site } from "../../data/site";
import { JelloText } from "../shared/JelloText";
import { NeuButton } from "../shared/NeuButton";
import { HeroIllustration } from "./HeroIllustration";
import {
  fadeUp,
  fadeIn,
  staggerContainer,
  withMotionPreference,
} from "../../lib/motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useIntro } from "../../hooks/useIntro";

const EGG_DISCOVERED_KEY = "portfolio-egg-discovered";

function readEggDiscovered(): boolean {
  try {
    return localStorage.getItem(EGG_DISCOVERED_KEY) === "1";
  } catch {
    return false;
  }
}

export function Hero() {
  const reduced = useReducedMotion();
  const introDone = useIntro();
  const item = withMotionPreference(fadeUp, reduced);
  const [eggDiscovered, setEggDiscovered] = useState(readEggDiscovered);

  // Fires on any click inside the illustration (the traffic-light buttons
  // live in HeroIllustration, left untouched) — retires the hint for good.
  function handleIllustrationClick() {
    if (eggDiscovered) return;
    setEggDiscovered(true);
    try {
      localStorage.setItem(EGG_DISCOVERED_KEY, "1");
    } catch {
      // localStorage unavailable — hint just won't persist across sessions
    }
  }

  return (
    <section
      id="home"
      className="flex min-h-screen w-full items-center justify-center px-6 pb-6 pt-32 sm:px-8 md:px-12 lg:px-16"
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-10">
        <motion.div
          className="order-1 flex w-full max-w-xl flex-col items-start"
          initial="hidden"
          animate={introDone ? "visible" : "hidden"}
          variants={staggerContainer(0.15)}
        >
          <motion.p
            variants={item}
            className="text-2xl font-medium text-ink md:text-4xl"
          >
            <JelloText text={site.greeting} />
          </motion.p>

          <motion.h1
            variants={item}
            className="mt-2 text-5xl md:text-6xl text-gradient-accent-animated animate-gradient-shift whitespace-nowrap text-[clamp(2.1rem,4.6vw,3.5rem)] font-black leading-tight tracking-tight"
          >
            <JelloText text="Apurva Mukherjee." />
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-2 text-2xl font-medium text-ink md:text-4xl"
          >
            <JelloText text={site.tagline} />
          </motion.p>

          <motion.p
            variants={item}
            className="mt-8 max-w-xl text-lg text-muted md:text-xl"
          >
            {site.summary}
          </motion.p>

          <motion.div variants={item} className="mt-10">
            <NeuButton href={site.contactHref}>Let's Talk!</NeuButton>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={introDone ? "visible" : "hidden"}
          variants={withMotionPreference(fadeIn, reduced)}
          className={`relative order-2 w-full ${!eggDiscovered ? "pt-16 lg:pt-0" : ""}`}
          onClickCapture={handleIllustrationClick}
        >
          {!eggDiscovered && (
            <motion.div
              aria-hidden
              initial={{ opacity: 0 }}
              animate={introDone ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="pointer-events-none absolute left-4 top-0 z-10 flex max-w-[11rem] flex-col items-start gap-1 font-mono text-xs font-medium leading-snug text-accent lg:-top-16"
            >
              <span>try clicking these traffic lights to close this tab</span>
              <motion.span
                animate={reduced ? undefined : { y: [0, 5, 0] }}
                transition={reduced ? undefined : { duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
              >
                <TbArrowDown className="h-4 w-4" />
              </motion.span>
            </motion.div>
          )}
          <HeroIllustration />
        </motion.div>
      </div>
    </section>
  );
}
