# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Next Voters is a nonpartisan, AI-powered civic education platform. Users ask civic questions and receive streaming, multi-perspective answers grounded in official party platforms via RAG (Retrieval-Augmented Generation).

## Commands

```bash
pnpm install        # Install dependencies
pnpm dev            # Start dev server
pnpm build          # Production build
pnpm start          # Start production server
pnpm lint           # Run ESLint
```

Local services (Qdrant + PostgreSQL) via Docker:
```bash
docker-compose up -d
```

## Architecture

### Framework & Routing

Next.js 16 with App Router. File-based routing under `app/`. API routes at `app/api/*/route.ts`. Server actions in `server-actions/`.

### RAG Pipeline (core feature)

1. Admin uploads PDF → chunked into 4-sentence segments (`lib/ai.ts`)
2. Chunks embedded via `text-embedding-3-small` (1536 dims)
3. Stored in Qdrant vector DB with metadata (region, political affiliation)
4. User query → embedded → cosine similarity search → top-2 chunks retrieved
5. LLM (`gpt-4.1-mini`) generates citation-backed response per party
6. Responses streamed via SSE from `app/api/chat/route.ts`

### Data Layer

- **Neon PostgreSQL + Kysely**: Type-safe SQL for `chat_count`, `admin_table`, `subscriptions` tables. Schema in `types/database.ts`, connection in `lib/db/index.ts`.
- **Supabase**: Auth (session management, OAuth), Storage (PDFs in `next-voters-summaries` bucket). Clients in `lib/supabase/` (browser, server, admin variants).
- **Qdrant**: Vector collections per region (e.g., `collection-ca`, `collection-us`). Client in `lib/qdrant.ts`.

### Auth Flow

`wrappers/AuthProvider.tsx` wraps the app, providing `useAuth()` hook for client components. Server-side auth via `createSupabaseServerClient()`. Protected routes defined in `data/protected-routes.ts`.

### Payments (Stripe)

Webhook at `app/api/stripe/webhook/route.ts` handles checkout completion and subscription updates. Tier (Basic/Pro) determined by Stripe price ID. Subscription state stored in Supabase `subscriptions` table.

### Key Directories

- `lib/chat-platform/` — Chat response generation, citation handling, region info lookup
- `data/` — Static config: supported regions/parties, AI model config, system prompts, topic options
- `components/ui/` — Shadcn/ui components (do not edit manually; use `npx shadcn-ui add`)
- `hooks/` — `useAuth`, `useSubscription`
- `types/` — TypeScript interfaces for database schema, regions, messages, citations

### Multi-Region Design

Regions and their political parties are defined in `data/supported-regions.ts`. Each region has its own Qdrant collection. Chat responses are generated per-party in parallel, then streamed as completed. User region/party preferences stored in localStorage via `lib/country-preference.ts`.

### LangGraph Research Agents

External LangGraph API provides multi-step research agents (`research-brief-agent`, `research-agent`). Invoked via `server-actions/research-actions.ts`.

## Environment Variables

Client-accessible vars use `NEXT_PUBLIC_` prefix. See `.env.example` for the full list. Key groups: OpenAI (LLM + embeddings), Qdrant (vectors), Neon (database), Supabase (auth + storage), Stripe (payments), Email (Nodemailer).
