
-- Create results table matching the provided INSERT format

CREATE TABLE IF NOT EXISTS results (
  id TEXT PRIMARY KEY,                       -- matches '001' style ids in your sample
  name TEXT NOT NULL,
  program TEXT,
  simulation TEXT,
  score INTEGER,
  confidence INTEGER,
  preparedness INTEGER,
  anxiety INTEGER,
  stress INTEGER,
  inserted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  record_id UUID                              -- can link to another record if needed
);

CREATE INDEX IF NOT EXISTS idx_results_program ON results(program);
CREATE INDEX IF NOT EXISTS idx_results_simulation ON results(simulation);
CREATE INDEX IF NOT EXISTS idx_results_inserted_at ON results(inserted_at);