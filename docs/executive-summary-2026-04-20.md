# Executive Summary — Week Ending 2026-04-20

## Overview
This week focused on shipping a **referral/K-factor growth system**, overhauling the **subscription dashboard**, and resolving **Next.js 16 build blockers** that were preventing deploys. Work spanned 22 commits across 2 merged PRs.

## Highlights

### New Features
- **Referral System with K-Factor Tracking** — Added end-to-end referral flow to measure and drive organic user growth.
- **Subscription Dashboard Upgrades** — Users can now select their **region**, **city**, and **preferred language** directly from the dashboard; city selection is bundled into topic management for a cleaner flow.
- **Dynamic Region Data** — Region selector now reads from Supabase `supported_cities` instead of hardcoded values.
- **Claude Workflow Subagents** — Added `civic-tech-builder` and `elite-design-challenger` subagents + project settings to streamline AI-assisted development.

### Fixes & Stability
- Unblocked the **Next.js 16 production build** by removing legacy `middleware.ts` and stale `better-auth` files.
- Fixed **city update RLS failure** by switching to the admin Supabase client.
- Migrated **subscription cancel/upgrade flows** from Supabase lookups to the **Stripe SDK** for a single source of truth.
- Hardened the Stripe webhook with proper error handling and standardized price-ID lookups.

### UX & Content
- Removed fellowship content, mission statement, and auth buttons from the landing page for a cleaner hero.
- Reordered nav (Local moved to second position) and clarified cancel-dialog copy to display the actual tier name.

### Code Health
- Dead-code sweep: removed unused migration scripts, `better-auth` remnants, and unused types.
- Standardized Stripe lookups across webhook, cancel, and upgrade routes.

## PRs Merged
- [#68 — Add Claude workflow subagents and auth setup](https://github.com/Next-Voters/Website/pull/68)

## What's Next
- Monitor referral conversion metrics now that K-factor tracking is live.
- Continue post-Next.js 16 migration hardening.
