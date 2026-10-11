# Pulse — AI Health Tracker

A responsive Next.js app for personal nutrition, activity, gym workouts, hydration, sleep/recovery, daily habits, goals, and an AI wellness coach. Designed for mobile and desktop, with Supabase storage and Gemini-powered food-photo estimates and coaching.

## Included
- Email/password sign-up and sign-in using Supabase Auth
- Row-level security policies so signed-in users only access their own records
- Manual food logging with calories, protein, carbs, fat, fibre, sugar, sodium and saturated fat
- Gemini food-photo nutrition estimate (review estimates before saving)
- Daily steps, distance, active time and optional activity burn logging
- Exercise log with muscle group, sets, reps, weight, rest, duration and optional estimated burn
- Water, sleep duration, bedtime/wake time, energy, soreness and optional weight log
- Habit checklist, configurable daily targets, and AI coach using current-day logs
- Vercel-ready Next.js project

## 1. Requirements
- Node.js 18.17+ (Node 20 LTS recommended)
- A Supabase project
- A Google AI Studio API key with access to a Gemini model that supports text and image input
- Vercel account for hosting (optional for local development)

## 2. Configure Supabase
1. Create a project at https://supabase.com.
2. Open **SQL Editor** and run `supabase/schema.sql`.
3. Open **Project Settings → API** and copy the Project URL and anon/public key.
4. In the project root, copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
5. In Supabase **Authentication → Providers → Email**, configure email/password and email confirmation as desired. For easiest local testing, you may disable email confirmation in a private test project; enable it for production.

## 3. Configure Gemini
1. Create an API key in Google AI Studio: https://aistudio.google.com/app/apikey
2. Set `GEMINI_API_KEY` in `.env.local`.
3. Set `GEMINI_MODEL` to a model name available to your API key and enabled for text/image requests. The requested default in this project is `gemini-3.8-flash`; model availability can vary by account and release. If you receive a model-not-found error, use the current model ID shown in Google AI Studio / Gemini API documentation.

**Keep the Gemini key server-side only. Do not add a `NEXT_PUBLIC_` prefix.** The API routes do not expose it to the browser.

## 4. Run locally
```bash
npm install
cp .env.example .env.local
# Fill in .env.local values
npm run dev
```
Open http://localhost:3000. Create an account, then log food/activity/workouts. Make sure the SQL schema has been run before saving.

## 5. Deploy to Vercel
1. Push this folder to a GitHub repository.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Add the same four environment variables in **Project Settings → Environment Variables**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `GEMINI_API_KEY`, and `GEMINI_MODEL`.
4. Deploy. After changing environment variables, redeploy.
5. In Supabase Auth URL Configuration, set the Site URL to your deployed Vercel URL and add it to Redirect URLs if needed.

## Important limitations / production checklist
- This is a complete starter app, not a medical device. Calorie/macro estimates and activity burn are approximate. Use a qualified clinician/dietitian for individualized medical advice.
- The activity form records *incremental* steps. If entering multiple times a day, add only new steps to avoid double-counting.
- Habit checkmarks are currently session-only; they reset when the page reloads. The wellness schema includes a `habits` JSON field if you want to persist them.
- The chart/history, automatic wearable integrations, personal records across dates, and scheduled reminders are not wired in this starter; the UI avoids pretending those features are active. Add a supported wearable API or reminder provider if needed.
- For production, consider rate-limiting the AI routes, validating Gemini output with a schema, adding file-content scanning, and configuring Supabase email templates / password reset.
- If the requested `gemini-3.8-flash` model is not available for your account, update `GEMINI_MODEL` to a currently supported model ID in Google AI Studio. The application surfaces a helpful error instead of silently fabricating an answer.
