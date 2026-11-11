const HEIGHTS = [226, 208, 236, 216]
const WIDTHS = [46, 52, 44, 56]
export const COVER_W = 164

// How far the book turns when pulled: the spine swings away, the front board swings toward you.
export const SPINE_TURN = 58
export const COVER_TURN = 24
const rad = (deg: number) => (deg * Math.PI) / 180
/** Fraction of each face's width still visible once turned. */
export const SPINE_SHOWN = Math.cos(rad(SPINE_TURN))
const COVER_SHOWN = Math.cos(rad(COVER_TURN))

/** Stable hash of the project name. Spine height/width are keyed to identity, not shelf
 *  position, so reordering a shelf never reshuffles its neighbors' dimensions. */
export function nameSeed(name: string): number {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0
  return Math.abs(h)
}

/** Footprint of a book on the board, closed and with its cover turned out. */
export function bookSize(name: string): { width: number; height: number; openWidth: number } {
  const seed = nameSeed(name)
  const width = WIDTHS[seed % WIDTHS.length]
  return {
    width,
    height: HEIGHTS[seed % HEIGHTS.length],
    openWidth: Math.round(width * SPINE_SHOWN + COVER_W * COVER_SHOWN),
  }
}
