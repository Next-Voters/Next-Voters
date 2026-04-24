# Supabase security notes

State of the Supabase **Security Advisor** for the `ihzytkomakaqhkqdrval` project, and the choices behind that state. Re-run the lints any time with `mcp__supabase__get_advisors({type: "security"})` or via Dashboard → Advisors → Security.

## Migrations applied (2026-04-24)

All applied to production via `mcp__supabase__apply_migration`. The full SQL bodies are stored in Supabase's migration history.

| Migration name | What it does |
|---|---|
| `security_advisor_fixes_rls_and_policies` | Enables RLS on every flagged `public.*` table. Adds public-read policies on `supported_cities` / `supported_topics` (mirrors `supported_languages`). Adds user-scoped SELECT/INSERT/DELETE on `subscription_topics` (`subscription_id = auth jwt email`). Drops permissive `WITH CHECK (true)` INSERT/UPDATE policies on `region_requests` / `region_votes` — admin-client (`service_role`) writes only. Locks `set_updated_at()` search_path. Drops the broad `Public read access on reports` storage policy (public bucket URLs still serve files; only listing was open). |
| `tighten_subscriptions_select_to_self` | Replaces `subscriptions_select_anon USING (true)` with `subscriptions_self_select` scoped to `contact = auth jwt email`. Stops anon enumeration of all subscription rows (emails + Stripe IDs). Server-client reads in `getUserCity` / `getUserLanguage` already filter by user email and remain functional. Admin-client reads continue to bypass via `service_role`. |
| `move_btree_gin_ltree_out_of_public` | `ALTER EXTENSION ... SET SCHEMA extensions` for both. Verified zero dependents in user code (no `ltree` columns; no GIN indexes on btree opclasses) before moving. |
| `nullify_unused_password_on_admin_user` | Sets `auth.users.encrypted_password = NULL` on the project owner's row (only user with a password; signs in via Google). See "Accepted lints" below. |

## Advisor state after migrations

### Resolved
- 14× ERROR `rls_disabled_in_public`
- 3× WARN `rls_policy_always_true` (region_requests INSERT/UPDATE, region_votes INSERT)
- 1× WARN `function_search_path_mutable` (`set_updated_at`)
- 1× WARN `public_bucket_allows_listing` (reports)
- 2× WARN `extension_in_public` (btree_gin, ltree)

### Accepted (intentionally not fixed)

#### 14× INFO `rls_enabled_no_policy`

Tables: `admin_table`, `chat_count`, `user_admin_requests`, plus 11 LangGraph internal tables (`assistant`, `assistant_versions`, `thread`, `thread_ttl`, `run`, `checkpoints`, `checkpoint_blobs`, `checkpoint_writes`, `store`, `cron`, `schema_migrations`).

These tables are only ever touched by:
- `service_role` (server-side admin-client calls in `server-actions/`, the Stripe webhook, and admin lookups in `lib/supabase/admin.ts`)
- `postgres` role (LangGraph external service connecting directly; pg_cron)

Both roles have `rolbypassrls = true`, so RLS is bypassed transparently. There is no PostgREST-reachable code path that needs a policy. Adding empty/permissive policies just to silence the linter would be cargo-culting.

If a future code path needs PostgREST access to one of these tables, add a scoped policy at that time.

#### 1× WARN `auth_leaked_password_protection`

Will not silence on free tier. The lint checks the auth config flag `password_hibp_enabled`, which can only be toggled on **Pro Plan and up** (Management API returns `"Configuring leaked password protection via HaveIBeenPwned.org is available on Pro Plans and up"`).

Mitigations applied so the lint is factually inert despite still firing:

1. **Zero password users in the database.** Verified post-migration: `SELECT count(*) FILTER (WHERE encrypted_password IS NOT NULL) FROM auth.users` returns `0`. The only password belonged to the project owner, who has always signed in via the Google identity linked to the same `auth.users` row.
2. **App code has no password sign-in path.** Every entry point is `signInWithOAuth({ provider: 'google' })` (see `app/login/page.tsx`, `components/local/onboarding/onboarding-wizard.tsx`, `components/local/onboarding/request-step.tsx`).

If passwords are ever introduced (e.g., adding email/password sign-up for accessibility), upgrade to Pro Plan and toggle the setting in **Dashboard → Authentication → Providers → Email → Password Settings**. Or implement HIBP checks in an Auth Hook before allowing password set/change — note this satisfies the security goal but does **not** silence the lint, which is purely config-flag-driven.

## Reverting any of the above

| If you want to… | Run |
|---|---|
| Re-enable email/password auth for the owner account | `Dashboard → Authentication → Users → ⋯ → Send password reset` (Google identity is unaffected) |
| Make `subscriptions` publicly readable again | `DROP POLICY subscriptions_self_select ON public.subscriptions; CREATE POLICY subscriptions_select_anon ON public.subscriptions FOR SELECT USING (true);` |
| Re-allow anonymous writes to `region_requests` / `region_votes` | Re-create the dropped `WITH CHECK (true)` policies (full bodies in Supabase migration history) |
| List files in the `reports` bucket via PostgREST | `CREATE POLICY "Public read access on reports" ON storage.objects FOR SELECT USING (bucket_id = 'reports');` |

## How to re-audit

```ts
// Anywhere with the Supabase MCP loaded:
mcp__supabase__get_advisors({ type: "security" });
mcp__supabase__get_advisors({ type: "performance" });
```

Compare against the "Accepted" list above. Anything new is real.
