import { motion } from 'framer-motion'
import { TbBrandGithub, TbCode, TbStar, TbUsers } from 'react-icons/tb'
import { useGithubStats } from '../../hooks/useGithubStats'
import { fadeUp, viewportOnce, withMotionPreference } from '../../lib/motion'
import { useReducedMotion } from '../../hooks/useReducedMotion'

export function GithubStats() {
  const reduced = useReducedMotion()
  const stats = useGithubStats()

  if (!stats) return null

  const tiles: { icon: typeof TbBrandGithub; label: string; value: string | number }[] = [
    { icon: TbBrandGithub, label: 'Public repos', value: stats.publicRepos },
    { icon: TbStar, label: 'Stars earned', value: stats.totalStars },
    { icon: TbUsers, label: 'Followers', value: stats.followers },
  ]
  if (stats.topLanguage) {
    tiles.push({ icon: TbCode, label: 'Top language', value: stats.topLanguage })
  }

  return (
    <motion.div
      className="mt-10 grid w-full grid-cols-2 gap-4 sm:grid-cols-4"
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={withMotionPreference(fadeUp, reduced)}
    >
      {tiles.map(({ icon: Icon, label, value }) => (
        <div
          key={label}
          className="flex flex-col items-center gap-2 rounded-xl border border-border bg-surface-raised px-4 py-5 text-center"
        >
          <Icon className="text-accent" size={20} aria-hidden />
          <span className="text-xl font-bold text-ink">{value}</span>
          <span className="text-xs text-muted">{label}</span>
        </div>
      ))}
    </motion.div>
  )
}
