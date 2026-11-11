# Interaction redesign

Date: 2026-11-11

## Concept

The site is one machine. Terminal, notch, command palette and code-tag headings are the
structure and the controls. Japanese motifs (torii, dragon, kanji, hanko seals) are ornament.

Audience order: recruiters first, developers second. Role, projects and contact must be
readable with no interaction; the playful layer is signposted and optional.

## Rules

| Area | Rule |
|---|---|
| Motion | Use the tokens in `src/lib/motion.ts`. `iosSpring` for hover and press, `iosSpringSoft` for sheets and overlays, `trackSpring` for values that follow scroll, `pointerSpring` for values that follow the pointer, `fadeUp` for entrances. The lantern physics in `PortraitFrame.tsx` are the one deliberate exception. |
| Ambient | Matrix rain belongs to the hero and fades out within 0.85 of a viewport. The `matrix` command and the Konami code bring it back page-wide for ten seconds. |
| Cursor | One glow, a click ripple, and a label. Any element with `data-cursor="verb"` shows that verb beside the pointer. Add it to anything a visitor can act on that does not look like a button. |
| Japanese motifs | Accent red, one per section. Every section heading carries a kanji chapter numeral. Ornament may react to the pointer but never navigates. |
| Scroll-linked effects | At most one per section. |
| Content | Nothing is gated behind an interaction. Reduced-motion and touch get the same content. |

## Commands

`src/data/commands.ts` is the only list of site actions. Each has a palette label and a
terminal `alias`.

- Palette (`⌘K`, the navbar pill, `> commands` in the mobile menu) lists them all.
- Terminal (`sudo`, footer hint, or the `terminal` command) runs any alias, then closes so the
  result is visible. `help` prints the list.
- Hero shell is a real prompt: it runs any alias, plus its five designed views, `help` and
  `clear`. It reads the list from `CommandsContext` (`src/hooks/useCommands.tsx`).

Add a new action in `buildCommands` only; all three surfaces pick it up.

## Hero terminal

- Typed input with history (↑ ↓), a completion ghost (Tab or → accepts) and a "did you mean"
  for typos. Clicking the screen focuses the prompt.
- Until the visitor touches it, the shell demos itself: it types through the five views, with
  a countdown line on the active chip. Any interaction ends the demo for good. The log is not
  announced to screen readers while the demo runs.
- The traffic lights work. Red ends the session and it restarts after 1.7s, so the hero is
  never left empty. Yellow folds the window to its title bar. Green gives the screen more rows.
- The window's edge and a soft glare follow the pointer through `--mx` / `--my`, written
  directly to the element (no React render per mouse move).

## Navbar avatar

A single bitmap, so no blinking or lip-sync. What it does: turns its head toward the cursor
anywhere on the page, leans into fast scrolling, perks up on hover, and hops and says the next
line on click. The lines give away the hidden features. Touch and reduced-motion keep the old
idle sway.

## State

`src/lib/ui.ts` (Zustand) holds overlay, matrix, the Projects tech filter and the Projects
view. Only the view is persisted, under `portfolio:ui`.

## Tech filter

`src/lib/tech.ts` folds spelling variants onto one key (`React.js`, `React 19` → `react`),
checked by `tech.selfcheck.ts`. Skill tiles and experience chips are buttons only when at
least one project uses that tech. In the list view the filter removes cards; on the shelf it
pushes non-matching books back so the layout does not move.

## Bookshelf

- Sixteen books on two boards of eight (`SHELF_BOARDS`), grouped by category with a
  directory-style plate (`~/open-source 03`) on the board edge.
- Exactly one book per board has its cover turned out, so a board never changes width. Hover
  or keyboard focus turns another one out; on touch the first tap turns it, the second opens it.
- The cover shows the first screenshot, name, one-line blurb and category. Screenshots load
  the first time a cover turns out.
- Clicking a turned-out cover opens the existing `OpenBook` spread. At `lg` and up it morphs
  from the book; below `lg` the board scrolls sideways, so the spread fades in instead.
- Geometry lives in `bookshelf/geometry.ts`.

## Sections

- Projects defaults to the list on a first visit; the shelf is one click away and remembered.
- Leadership cards carry a hanko seal (one kanji per role) that stamps in on scroll.
- The footer is the contact section (`#contact`): copy-email with confirmation and a
  mail-app fallback, resume, LinkedIn, then socials and the `sudo` hint.
- The floating resume button stays.

## Not done

Smooth-scroll library, WebGL, sound effects, a page-wide dragon. No dependencies were added.
