# Orbit — Adaptive Learning

A responsive classroom-learning app for Indian students in Classes 6–10, with a React/Vite client and an Express API.

## Run locally

1. Install Node.js 18 or newer.
2. From this folder, run `npm install`.
3. Run `npm run dev`, then open the Vite URL shown in the terminal.
4. For a production build, run `npm run build` and then `npm start` (the Express server serves `dist` and the API on port 4000).

## Sign in

Use the unified sign-in form. The demo PIN is `1234`; role routing is detected from the ID prefix. Demo accounts:

- Student: `STU-2026-014`
- Parent: `PAR-2026-014`
- Teacher: `TCH-2048`

IDs such as `STU2026101`, `PAR2026101`, and `TCH2026101` are also accepted with the demo PIN. Sessions, preferences, student credits, vocabulary, and learning attendance persist in the browser's LocalStorage.

## Included learning spaces

- Student dashboard, adaptive practice and timed check-in, subject rooms, vocabulary dictionary, revision handbooks, daily word activity, rewards, and teacher chat.
- Parent progress, academic tier, downloadable report card, teacher updates, physical attendance, and app learning attendance.
- Teacher classroom, score-based mastery groups and roster, teacher-marked school attendance, inbox, assignment/note/handbook publishing, grading, and badge verification.
- English, Hindi, Telugu, Tamil, Kannada, and Malayalam navigation, plus Dark, Light, and Black & Gold themes.

The Express demo server keeps classroom posts, messages, grades, and daily word submissions in memory. Demo roster, attendance, and assessment data are illustrative; connect a school database, authorization, and a real identity provider before production use.
