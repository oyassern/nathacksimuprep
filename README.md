# MCQ Generator (Next.js + Supabase + OpenAI)

A beginner-friendly Next.js app that generates multiple-choice questions using OpenAI and stores them in Supabase. Minimal code, no extra complexity.

## Features
- Generate MCQs for a topic via `/api/generate`.
- Store questions in Supabase `questions` table.
- List questions at `/questions`.
- View/Edit/Delete a question at `/questions/[id]`.

## Stack
- Next.js App Router (JavaScript)
- Supabase (Postgres via `@supabase/supabase-js`)
- OpenAI (chat completions)

## Setup
1. Install deps:
   - `npm install`
2. Create `.env.local` from example:
   - `cp .env.example .env.local`
   - Fill:
     - `OPENAI_API_KEY`
     - `SUPABASE_URL`
     - `SUPABASE_SERVICE_ROLE_KEY`
3. Create table in Supabase (SQL):
   ```sql
   create table if not exists public.questions (
     id uuid primary key default gen_random_uuid(),
     topic text,
     question_text text,
     option_a text,
     option_b text,
     option_c text,
     option_d text,
     correct_option text check (correct_option in ('a','b','c','d')),
     created_at timestamp with time zone default now()
   );
   -- For learning, you can keep RLS off initially:
   alter table public.questions disable row level security;
   ```
4. Run the app:
   - `npm run dev`
   - Open `http://localhost:3000`

## How it Works (Simple)
- Client components call your own API routes (not Supabase directly).
- API routes run on the server, use the Supabase service role key, and keep secrets safe.
- `/api/generate` prompts OpenAI to return strict JSON, parses it, and inserts rows.

## Files to Explore
- `app/page.jsx`: Home with generate form
- `app/questions/page.jsx`: List all questions
- `app/questions/[id]/page.jsx`: View/edit/delete one
- `app/api/generate/route.js`: Calls OpenAI and inserts into DB
- `app/api/questions/route.js`: List
- `app/api/questions/[id]/route.js`: Get/Update/Delete
- `lib/supabaseAdmin.js`: Server Supabase client

## Notes
- Keep the count small (1–5) to control token usage.
- You can later switch to Supabase Auth + RLS and call Supabase from the client if you want to learn that pattern.

# nathacksSimuprep
