import type { IconType } from 'react-icons'
import { TbBrandOpenSource, TbBrandReactNative, TbDeviceGamepad2Filled, TbDeviceMobileFilled, TbFlaskFilled } from 'react-icons/tb'
import type { ShelfCategory } from '../data/projects'

/** Book-cloth tones, assigned by spine identity so a project keeps its color across reorders. */
export const CLOTH = [
  'bg-cloth-1', 'bg-cloth-2', 'bg-cloth-3', 'bg-cloth-4',
  'bg-cloth-5', 'bg-cloth-6', 'bg-cloth-7', 'bg-cloth-8',
] as const

/** Small foil-stamp glyph per category, embossed near the base of each book spine. */
export const CATEGORY_ICON: Record<ShelfCategory, IconType> = {
  oss: TbBrandOpenSource,
  games: TbDeviceGamepad2Filled,
  apps: TbDeviceMobileFilled,
  native: TbBrandReactNative,
  exp: TbFlaskFilled,
}
