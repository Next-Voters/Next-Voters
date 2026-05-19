-- Rename supported_types to supported_region_types for consistency
-- Applied 2026-05-19 via Supabase MCP

ALTER TABLE supported_types RENAME TO supported_region_types;
ALTER TABLE supported_region_types RENAME CONSTRAINT supported_types_pkey TO supported_region_types_pkey;
