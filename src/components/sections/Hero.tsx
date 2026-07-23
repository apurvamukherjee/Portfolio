import { motion } from "framer-motion";
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

export function Hero() {
  const reduced = useReducedMotion();
  const introDone = useIntro();
  const item = withMotionPreference(fadeUp, reduced);

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
          className="order-2 w-full"
        >
          <HeroIllustration />
        </motion.div>
      </div>
    </section>
  );
}
