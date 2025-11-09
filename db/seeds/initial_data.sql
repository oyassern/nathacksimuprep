-- initial_data.sql
-- Purpose:
--   Seed file containing example data for a fresh database. It inserts a set
--   of sample `simulations` and example `questions` to help verify the schema
--   and to provide demo content for local development.
--
-- Usage:
--   - Run this after applying the migrations (e.g. after running
--     `psql "$SUPABASE_DB_CONN" -f db/migrations/001_initial_schema.sql`).
--   - Apply with psql:
--       psql "$SUPABASE_DB_CONN" -f db/seeds/initial_data.sql
--   - Or run via a seeding script that uses the admin Supabase client.
--
-- Notes:
--   - The `questions` inserts reference `simulations` by name; ensure the
--     `simulations` rows exist before inserting questions.
--   - For large question sets (e.g. from OpenAI) prefer a scripted bulk
--     insert that looks up simulation IDs and batches inserts.

-- Insert the 9 simulations
INSERT INTO simulations (name, program, description) VALUES
-- Animal Health (3 simulations)
('Dog Fight', 'animal_health', 'Management of dog fight injuries and trauma'),
('Euthanasia: Cat', 'animal_health', 'Ethical and procedural considerations for feline euthanasia'),
('Euthanasia: Terrier', 'animal_health', 'Euthanasia procedures for terrier breed specific considerations'),

-- Paramedicine (2 simulations)  
('NAIT Pool: Pediatric Choking/Arrest', 'paramedicine', 'Pediatric emergency response for choking and cardiac arrest'),
('Peds ER: Cardiac Emergency', 'paramedicine', 'Pediatric cardiac emergency management'),

-- Respiratory Therapy (4 simulations)
('RESP 2695', 'respiratory_therapy', 'Advanced respiratory care procedures'),
('Respiratory Simulation 2', 'respiratory_therapy', 'Second respiratory therapy scenario'),
('Respiratory Simulation 3', 'respiratory_therapy', 'Third respiratory therapy scenario'),
('Respiratory Simulation 4', 'respiratory_therapy', 'Fourth respiratory therapy scenario');

-- Example questions for "Dog Fight" simulation (you'll replace with your actual OpenAI questions)
INSERT INTO questions (simulation_id, question_text, option_a, option_b, option_c, option_d, option_e, correct_answer, explanation) VALUES
(
  (SELECT id FROM simulations WHERE name = 'Dog Fight'),
  'What is the first priority when managing multiple dogs after a fight?',
  'Separate the animals immediately',
  'Assess for life-threatening injuries', 
  'Administer sedatives to all animals',
  'Clean visible wounds',
  'Document the incident',
  'a',
  'The first priority is always to separate fighting animals to prevent further injury.'
),
(
  (SELECT id FROM simulations WHERE name = 'Dog Fight'),
  'Which type of wound requires immediate surgical intervention?',
  'Superficial abrasions',
  'Deep puncture wounds to the thorax',
  'Minor lacerations',
  'Bruising without broken skin',
  'All of the above',
  'b',
  'Deep puncture wounds to the thorax can lead to pneumothorax and require immediate surgical attention.'
);

-- Add your actual questions from OpenAI here following the same pattern
-- For each simulation, add multiple INSERT statements like above