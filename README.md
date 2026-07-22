# Apurva Mukherjee — Portfolio

Personal portfolio site at [apurva.space](https://apurva.space), built with React 19,
TypeScript, Tailwind CSS, and Framer Motion. Black + red hacker/terminal aesthetic:
a Matrix-rain background, `</Tag>` style section headings, an interactive terminal
illustration, and tilt-on-hover cards throughout.

## Stack

- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS v4** (CSS-first config, no `tailwind.config.js`)
- **Framer Motion** for scroll reveals, hover tilt, and page transitions
- **react-icons** (Simple Icons + Tabler) — no emoji, no icon-font CDNs

## Structure

```
src/
  components/
    layout/     Navbar, mobile menu, footer, preloader, floating buttons
    shared/     Reusable primitives — SectionHeading, GradientSweepCard (the
                shared tilt/hover-sweep card), ImageSlideshow, ThemeToggle, ...
    sections/   One component per landing-page section (Hero, About, Skills, ...)
  data/         Site content as typed data (skills, projects, experience, ...) —
                edit these to change copy/links, no JSX required
  hooks/        useTheme, useReducedMotion, useScrollSpy, useMagnetic, ...
  lib/motion.ts Shared Framer Motion variants (fadeUp/staggerContainer/...)
public/
  assets/       Images, logos, project screenshots
  assets/resume/ Resume PDF served at /assets/resume/ApurvaMukherjee.pdf
  CNAME         Custom domain for GitHub Pages (apurva.space)
```

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-checks + production build into dist/
npm run preview  # serve the production build locally
```

## Editing content

Almost everything on the page — skills, experience timeline, projects, leadership
events, social links — lives in `src/data/*.ts` as plain typed objects. Update those
files rather than editing JSX directly; the components just render whatever's there.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the site and
publishes `dist/` to GitHub Pages (repo **Settings → Pages → Source** must be set to
**GitHub Actions**). The custom domain is served via `public/CNAME` → `apurva.space`;
DNS is four `A` records at the GitHub Pages IPs (185.199.108/109/110/111.153) plus a
`www` CNAME, both set to **DNS only** (not proxied) in Cloudflare.
