import { motion } from 'framer-motion'
import { site } from '../../data/site'
import { JelloText } from '../shared/JelloText'
import { NeuButton } from '../shared/NeuButton'
import { HeroIllustration } from './HeroIllustration'
import { fadeUp, fadeIn, staggerContainer, viewportOnce, withMotionPreference } from '../../lib/motion'
import { useReducedMotion } from '../../hooks/useReducedMotion'

export function Hero() {
  const reduced = useReducedMotion()
  const item = withMotionPreference(fadeUp, reduced)

  return (
    <section
      id="home"
      className="flex min-h-screen w-full items-center justify-center px-6 pb-16 pt-32 sm:px-8 md:px-12 lg:px-16"
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-10">
        <motion.div
          className="order-1 flex w-full max-w-xl flex-col items-start"
          initial="hidden"
          animate="visible"
          variants={staggerContainer(0.15)}
        >
          <motion.p variants={item} className="text-2xl font-medium text-ink md:text-4xl">
            <JelloText text={site.greeting} />
          </motion.p>

          <motion.h1
            variants={item}
            className="text-gradient-accent-animated animate-gradient-shift whitespace-nowrap text-[clamp(1.75rem,3.4vw,3rem)] font-black leading-tight"
          >
            <JelloText text="Apurva Mukherjee." />
          </motion.h1>

          <motion.p variants={item} className="mt-8 text-3xl font-medium text-ink md:text-5xl">
            <JelloText text={site.tagline} />
          </motion.p>

          <motion.p variants={item} className="mt-8 max-w-xl text-lg text-muted md:text-xl">
            {site.summary}
          </motion.p>

          <motion.div variants={item} className="mt-10">
            <NeuButton href={site.contactHref}>Let's Talk!</NeuButton>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={withMotionPreference(fadeIn, reduced)}
          className="order-2 w-full"
        >
          <HeroIllustration />
        </motion.div>
      </div>
    </section>
  )
}
