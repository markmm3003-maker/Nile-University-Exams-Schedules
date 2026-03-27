# Deep Project Analysis — Nile University Exams Schedules

## 1) Project Overview
This repository is a static, client-only web application that lets a student enter their ID and retrieve their personal midterm schedule.

- **Frontend/UI**: single `index.html` file with inline CSS + JavaScript.
- **Data store**: `data.json` maps SHA-256 hashes of student IDs to arrays of exam records.
- **Project purpose**: improve usability of a messy spreadsheet workflow by offering direct lookup.

This is intentionally lightweight and deployment-friendly (can be hosted on GitHub Pages / any static server).

---

## 2) How the System Works

### Request flow
1. User enters a student ID in the text input.
2. The client normalizes the input (`trim().toLowerCase()`) and computes SHA-256 with Web Crypto API.
3. The app fetches `data.json` (lazy-loaded once, then cached in `_db`).
4. It looks up `db[hash]` and renders a table if found.

### Core strengths in implementation
- No backend dependency.
- Data is fetched once and reused in-memory.
- Explicit status handling (`loading`, `error`, `ok`) gives clear UX feedback.
- Table render logic is simple and readable.

---

## 3) Data Profile (Current Snapshot)

I profiled the current `data.json` structure and found:

- **4221 hashed student IDs**.
- **17,988 total exam rows**.
- Exams per student: **min 1**, **max 9**, **average ~4.26**.
- **228 unique course codes**.
- **64 unique room labels**.
- Date range spans **2026-03-28 through 2026-04-08**.
- No exact duplicate exam rows detected.
- No per-student time-slot collisions detected.

Interpretation:
- Data quality is reasonably clean structurally.
- Scheduling density is concentrated in a short exam window.
- The schema is stable and easy to transform.

---

## 4) UX and Product Analysis

### What works well
- Clean visual design, modern typography, and clear hierarchy.
- Immediate single-purpose interaction (input + one action button).
- Includes a caution banner warning users to verify with official schedule.
- Contact section is helpful for support/reporting issues.

### Friction points
- No inline format guidance for valid student ID patterns beyond placeholder.
- "Not found" could include actionable suggestions (e.g., check leading zeroes).
- No sorting/filtering export for users with many exams.
- No explicit loading skeleton; only text status.

### Accessibility considerations
- Good color contrast in many areas, but some muted text may be borderline on smaller displays.
- Button and input are keyboard friendly; Enter key is handled.
- Could improve semantics with ARIA live region for status updates.

---

## 5) Security & Privacy Analysis

### Current privacy posture
The app avoids sending IDs to a backend, which is good. However, it ships a full hash-indexed dataset to every client.

### Key risks
1. **Unsalted hash lookup risk**: SHA-256 of student IDs can be brute-forced if ID format is predictable.
2. **Full dataset exposure**: everyone downloading `data.json` gets all hashed identities + schedules.
3. **PII adjacency**: while plain IDs are not stored, schedule details may still be sensitive.

### Risk level assessment
- For small numeric ID spaces, practical re-identification risk is **moderate to high**.
- Hashing alone should not be treated as anonymization in this context.

### Recommended mitigations (ordered)
1. Move lookup server-side and return only a single student record per request.
2. If staying static-only, consider distributing per-cohort shards with access controls.
3. Add strict ID normalization rules and validation to reduce accidental misses.
4. Add rate limiting / bot protection if a backend endpoint is introduced.

---

## 6) Codebase Maintainability Review

### Current state
- Simple, understandable single-file structure.
- Fast to edit for small changes.

### Scaling concerns
- Inline CSS + JS in one file becomes hard to maintain over time.
- No automated tests.
- No data schema contract/versioning.
- No build/format/lint pipeline.

### Suggested refactor path
1. Split into `styles.css`, `app.js`, `index.html`.
2. Define and document schema (`schemaVersion`, required keys).
3. Add validation step for `data.json` generation (CI).
4. Add minimal unit tests for hash normalization and rendering guards.

---

## 7) Performance Analysis

### Strengths
- Single network fetch for data.
- No heavy framework/runtime overhead.
- Client-side rendering is lightweight.

### Potential bottlenecks
- `data.json` size growth impacts initial load time.
- Parsing a large JSON blob blocks main thread on low-end devices.

### Optimizations to consider
- Compress with gzip/brotli at hosting layer.
- Split dataset into smaller chunks (e.g., by faculty/level/term).
- Precompute lightweight index structures if record volume increases.

---

## 8) Reliability & Data Operations

### Operational gap
This repo appears to contain output data but not the reproducible pipeline used to convert the original spreadsheet into `data.json`.

### Recommendation
Create a deterministic ETL script and document it:
- Input format assumptions.
- Normalization rules (time formats, room naming, course code casing).
- Validation checks (duplicates, overlapping slots, invalid dates).
- Output fingerprinting/versioning.

This will reduce manual errors and support future terms safely.

---

## 9) Priority Roadmap

### Immediate (high impact, low-medium effort)
- Add ID format validation and better "not found" guidance.
- Add ARIA live region for status messages.
- Document data update process in `README.md`.

### Near term (high impact)
- Move to backend-assisted lookup to avoid bulk dataset disclosure.
- Add data schema validation and CI checks.

### Later (quality and scale)
- Refactor into modular files.
- Add analytics for anonymous usage patterns (optional, privacy-conscious).
- Add multilingual support if target audience expands.

---

## 10) Final Assessment

This project is a strong practical solution for a real student pain point: it is simple, elegant, and effective. Its biggest structural risk is not UI or performance, but privacy/security model (publishing full hashed dataset client-side). If the project remains small and community-trusted, it can still be useful; if it is expected to scale or become official, a server-side lookup architecture is strongly recommended.
