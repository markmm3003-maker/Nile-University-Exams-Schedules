# Nile University Exams Schedules (Next.js)

Yes — this project can be turned into a Next.js app, and this repository now includes that migration.

## What changed
- Migrated from a single static `index.html` page to a **Next.js App Router** structure.
- Preserved the same lookup behavior:
  - Student ID is normalized (`trim + lowercase`).
  - SHA-256 hash is computed in-browser.
  - Data is fetched from `public/data.json`.
  - Matching exams are rendered in a table.

## Project structure
- `app/page.tsx` → main page.
- `components/schedule-lookup.tsx` → client-side lookup UI and logic.
- `app/globals.css` → styling.
- `public/data.json` → hashed schedule database.

## Run locally
```bash
npm install
npm run dev
```
Then open `http://localhost:3000`.

## Build for production
```bash
npm run build
npm run start
```

## Notes
- The old static files (`index.html`, root `data.json`) are still kept for reference/backward compatibility.
- For better privacy at scale, consider moving lookup to a server/API route so the entire dataset is not distributed to every browser.
