import type { ReactNode } from 'react'

interface MacBookFrameProps {
  children: ReactNode
}

/** Minimal laptop mockup — frames website screenshots the way PhoneFrame frames app screenshots. */
export function MacBookFrame({ children }: MacBookFrameProps) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-black p-4 sm:p-6">
      <div className="w-full max-w-2xl">
        <div className="relative rounded-t-lg border border-white/10 bg-[#1a1a1e] p-1.5 pt-3">
          <span aria-hidden className="absolute left-1/2 top-1 h-1 w-1 -translate-x-1/2 rounded-full bg-white/20" />
          <div className="relative aspect-video w-full overflow-hidden rounded-md bg-black">{children}</div>
        </div>
        <div className="mx-auto h-2.5 w-full rounded-b-xl bg-gradient-to-b from-[#2a2a30] to-[#141416]" />
        <div className="mx-auto h-1.5 w-1/4 rounded-b-md bg-[#0d0d10]" />
      </div>
    </div>
  )
}
