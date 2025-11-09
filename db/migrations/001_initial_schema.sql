-- 001_initial_schema.sql
-- Purpose:
--   Initial database migration for the project. This file creates the core
--   schema objects used by the application: programs enum, `simulations`, and
--   `questions` tables. It also creates helpful indexes and enables basic
--   Row Level Security (RLS) policies for a sensible default environment.
--
-- Usage:
--   - Apply this migration first when provisioning a fresh database.
--   - With supabase CLI: place under `db/migrations/` and run `supabase db push`.
--   - Or use psql with the connection string:
--       psql "$SUPABASE_DB_CONN" -f db/migrations/001_initial_schema.sql
--
-- Notes:
--   - This migration uses `gen_random_uuid()` (ensure `pgcrypto` or relevant
--     UUID extension is available on your DB). Adjust extension statements to
--     your Postgres environment if needed.


-- Create programs enum
CREATE TYPE program_type AS ENUM ('paramedicine', 'animal_health', 'respiratory_therapy');

-- Create simulations table
CREATE TABLE simulations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  program program_type NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create questions table
CREATE TABLE questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  simulation_id UUID REFERENCES simulations(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  option_e TEXT, -- Optional 5th option
  correct_answer CHAR(1) NOT NULL CHECK (correct_answer IN ('a', 'b', 'c', 'd', 'e')),
  explanation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_questions_simulation_id ON questions(simulation_id);
CREATE INDEX idx_simulations_program ON simulations(program);

-- Enable Row Level Security
ALTER TABLE simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust based on your needs)
CREATE POLICY "Simulations are viewable by everyone" ON simulations FOR SELECT USING (true);
CREATE POLICY "Questions are viewable by everyone" ON questions FOR SELECT USING (true);