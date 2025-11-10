-- 004_check_simulations.sql
-- Verify database structure and check existing data

-- Check enum types
SELECT 'Enum Types:' as info;
SELECT typname as enum_name, enumlabel as value
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid
WHERE t.typname = 'program_type';

-- Check table structures
SELECT 'Simulations Table:' as info;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'simulations' 
ORDER BY ordinal_position;

SELECT 'Questions Table:' as info;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'questions' 
ORDER BY ordinal_position;

-- Check simulation counts
SELECT 'Simulation Counts by Program:' as info;
SELECT program, COUNT(*) as count
FROM simulations 
GROUP BY program 
ORDER BY program;

-- Check question counts
SELECT 'Question Counts per Simulation:' as info;
SELECT s.name, s.program, COUNT(q.id) as question_count
FROM simulations s
LEFT JOIN questions q ON s.id = q.simulation_id
GROUP BY s.id, s.name, s.program
ORDER BY s.program, s.name;

-- Check for data issues
SELECT 'Data Quality Check:' as info;
SELECT 
  (SELECT COUNT(*) FROM questions WHERE option_a IS NULL OR option_b IS NULL OR option_c IS NULL OR option_d IS NULL) as questions_with_null_options,
  (SELECT COUNT(*) FROM questions WHERE correct_answer NOT IN ('a', 'b', 'c', 'd')) as questions_with_invalid_answers;