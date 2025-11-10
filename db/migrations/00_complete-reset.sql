-- 005_complete_reset.sql
-- Complete database reset (WARNING: Deletes all data)

DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS simulations CASCADE;
DROP TYPE IF EXISTS program_type CASCADE;