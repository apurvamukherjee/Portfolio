import type { IconType } from 'react-icons'
import { TbBrandReactNative, TbDeviceGamepad2Filled, TbDeviceMobileFilled, TbFlaskFilled } from 'react-icons/tb'
import type { ShelfCategory } from '../data/projects'

/** Tailwind gradient stop classes per shelf category — spines, monogram chips, and other project badges share this so the color language stays consistent between the bookshelf and the list view. */
export const CAT_GRADIENT: Record<ShelfCategory, string> = {
  games: 'from-accent to-accent-deep',
  apps: 'from-cat-apps to-cat-apps-deep',
  native: 'from-cat-native to-cat-native-deep',
  exp: 'from-cat-exp to-cat-exp-deep',
}

/** Small foil-stamp glyph per category, embossed near the base of each book spine. */
export const CATEGORY_ICON: Record<ShelfCategory, IconType> = {
  games: TbDeviceGamepad2Filled,
  apps: TbDeviceMobileFilled,
  native: TbBrandReactNative,
  exp: TbFlaskFilled,
}

export const BADGE_BG: Record<'red' | 'blue' | 'violet', string> = {
  red: 'bg-red-600',
  blue: 'bg-blue-600',
  violet: 'bg-violet-600',
}

export const PLACEHOLDER_BG: Record<'red' | 'blue' | 'violet', string> = {
  red: 'from-red-950',
  blue: 'from-blue-950',
  violet: 'from-violet-950',
}
