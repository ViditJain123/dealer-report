import 'server-only';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import type { Database } from './types';

let client: SupabaseClient<Database> | undefined;

/**
 * Returns the server-side Supabase client (lazy singleton).
 *
 * Uses the service-role key, which bypasses Row Level Security — the Next.js
 * server is the authorization boundary. Every Supabase query in this project
 * goes through here and runs server-side.
 *
 * Never import this module from a Client Component or the `rnapp/` React Native
 * app: the `server-only` import above turns any such import into a build error.
 */
export function getSupabaseClient(): SupabaseClient<Database> {
  if (client) {
    return client;
  }

  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      'Missing Supabase environment variables. Set SUPABASE_URL and ' +
        'SUPABASE_SERVICE_ROLE_KEY in .env.local (see .env.example).',
    );
  }

  client = createClient<Database>(url, serviceRoleKey, {
    // No Supabase Auth in this project: a server-side service-role client has
    // no session to persist or refresh.
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return client;
}
