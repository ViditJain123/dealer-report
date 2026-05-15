<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

So this is combo of next js + react native application
We will be using next js for backend + frontend of webapp and react native app which lies in rnapp for the ios/android app we will be creating.
<!-- END:nextjs-agent-rules -->

# Database

We use **Supabase** as the database — only its Postgres database. We do **not** use Supabase Auth, Storage, Realtime, or Edge Functions.

- **Server-side only.** Every Supabase query runs server-side in the Next.js app via `getSupabaseClient()` from `src/lib/supabase/server.ts`. Never import the Supabase client into a Client Component or into the `rnapp/` React Native app — the module imports `server-only`, so any such import fails the build.
- **The RN app never touches Supabase directly.** It reads and writes data through the Next.js API.
- **Env vars** `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are server-only — never `NEXT_PUBLIC_`-prefixed, never committed. See `.env.example`.
- The service-role key bypasses Row Level Security; the Next.js server is the authorization boundary.
- DB types live in `src/lib/supabase/types.ts` — a placeholder until tables exist, then regenerated with `supabase gen types typescript`.
