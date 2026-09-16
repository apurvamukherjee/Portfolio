import type { IconType } from 'react-icons'
import { TbBrandApple, TbBrandReactNative, TbDeviceGamepad2Filled, TbDeviceMobileFilled, TbFlaskFilled } from 'react-icons/tb'
import type { ShelfCategory } from '../data/projects'

/** Book-cloth tones. Four flat graphite shades assigned by spine identity, not category —
 *  a shelf should read as a run of related volumes. Category is carried by the shelf label
 *  and the foil glyph instead, so the palette never turns into a color key. */
export const CLOTH = ['bg-cloth-1', 'bg-cloth-2', 'bg-cloth-3', 'bg-cloth-4'] as const

/** Small foil-stamp glyph per category, embossed near the base of each book spine. */
export const CATEGORY_ICON: Record<ShelfCategory, IconType> = {
  games: TbDeviceGamepad2Filled,
  apps: TbDeviceMobileFilled,
  mac: TbBrandApple,
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
