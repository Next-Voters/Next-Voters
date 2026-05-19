-- Supported types lookup table with FK constraint on regions.type
-- Applied 2026-05-19 via Supabase MCP

-- 1. Create the supported_types lookup table
CREATE TABLE supported_types (
  type TEXT PRIMARY KEY
);

-- 2. Seed with known types
INSERT INTO supported_types (type) VALUES ('city'), ('state'), ('country');

-- 3. Add FK from regions.type → supported_types.type
ALTER TABLE regions
  ADD CONSTRAINT regions_type_fkey
  FOREIGN KEY (type) REFERENCES supported_types (type);
