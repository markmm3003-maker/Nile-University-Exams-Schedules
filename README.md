# Nile University Exams Schedules (Next.js 16.2.1)

This project is now migrated to **Next.js 16.2.1** with a **shadcn/ui-only component approach** and a **Vercel-style light/dark design system**.

## What is included
- Next.js App Router application (`app/`)
- shadcn/ui-based interface components (`components/ui/`)
- Light and dark theme switching via `next-themes`
- Design tokens defined in CSS variables (no hard-coded colors inside React components)
- Client-side SHA-256 student lookup logic preserved

## Core files
- `app/page.tsx` → page composition using shadcn components
- `components/schedule-lookup.tsx` → lookup form + results table
- `components/theme-toggle.tsx` / `components/theme-provider.tsx` → theme handling
- `app/globals.css` → Vercel-like tokenized theme variables
- `public/data.json` → hashed schedule database

## Run locally
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
npm run start
```

## Notes
- Root `data.json` and `index.html` are retained for backward compatibility/reference.
- For stronger privacy, consider server-side lookup so the full dataset is not downloaded by every client.
