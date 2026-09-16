<div align="center">

# Messages

**A realtime chat app that looks and feels like iMessage — built from scratch with React and Firebase.**

No UI framework. No component library. Every pixel, every animation, every bubble tail — hand-built.

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![Firebase](https://img.shields.io/badge/Firebase-10.12-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-13-0055FF?logo=framer&logoColor=white)](https://motion.dev)
![Tests](https://img.shields.io/badge/tests-32_passing-34C759)
![Lint](https://img.shields.io/badge/eslint-0_warnings-34C759)

<br>

<img src="docs/screenshots/chat-light.png" alt="The chat interface in light mode" width="100%">

</div>

<br>

## Every color is a CSS variable

The palette is declared once and redefined under `prefers-color-scheme` — the entire
app repaints from a single source of truth, with an in-app toggle that overrides the
system when you want it to.

<table>
<tr>
<td width="50%"><img src="docs/screenshots/chat-dark.png" alt="Dark mode"></td>
<td width="50%"><img src="docs/screenshots/login-dark.png" alt="Sign-in screen, dark mode"></td>
</tr>
</table>

<br>

## Voice notes with real waveforms, link cards, and reactions

Voice messages record through the `MediaRecorder` API with a live input-level meter,
then play back against a waveform derived deterministically from the clip — so it
renders identically for both people in the chat. Pasted links unfurl into cards.
Long-press or right-click opens the reaction bar and action sheet.

<table>
<tr>
<td width="50%"><img src="docs/screenshots/features-light.png" alt="Voice notes and link previews"></td>
<td width="50%"><img src="docs/screenshots/actions.png" alt="Reaction bar and action sheet"></td>
</tr>
</table>

<br>

## Down to 390px, no compromises

The three-pane desktop layout collapses to a single pane on mobile, contact panel
sliding in off-canvas. No horizontal scroll, no broken breakpoints, at any width.

<div align="center">
<img src="docs/screenshots/mobile-chat.png" alt="Mobile layout, light mode" width="30%">
<img src="docs/screenshots/mobile-dark.png" alt="Mobile layout, dark mode" width="30%">
<img src="docs/screenshots/login-light.png" alt="Sign-in screen" width="30%">
</div>

<br>

## What's under the hood

| | |
|---|---|
| **iMessage-style bubbles** | Consecutive messages group into runs; only the last bubble in a run gets a tail |
| **Reactions & replies** | Concurrency-safe `arrayUnion` writes; swipe-to-quote with haptic feedback |
| **Edit & delete** | In-place editing with an `edited` marker; deletes leave a tombstone, not a gap |
| **Voice notes** | `MediaRecorder` capture, live level meter, deterministic waveform playback |
| **Link previews** | Auto-detected URLs render as cards, with thumbnails for video hosts |
| **Global search** | Searches usernames and message text across every conversation at once |
| **Pin & archive** | Pinned chats sort to the top; archived chats collapse behind a counted toggle |
| **Typing & presence** | TTL'd typing indicators and a `lastSeen` heartbeat — nothing gets stuck |
| **Read receipts** | Delivered/read state tracked on the most recent outgoing message |
| **Dark mode** | System-following, with a manual override persisted per browser |

Messages live as their own Firestore documents (not array fields), which is what
makes stable per-message IDs — and therefore reactions, edits, deletes, and replies —
possible at all, with no 1 MB document ceiling and no read-modify-write races between
two people sending at once.

<br>

## Built with

React 18 · Vite 5 · Firebase 10 (Auth, Firestore, Storage) · Framer Motion 13 ·
React Router 6 · Vitest · Playwright

32 unit tests, zero lint warnings, hand-drawn SVG icons, zero CSS dependencies.

---

<div align="center">
<sub>Built by <a href="https://github.com/">Apurva Mukherjee</a></sub>
</div>
