import { NextResponse } from 'next/server';

import { getSupabaseClient } from '@/lib/supabase/server';

// Always run at request time — a health check must never be cached.
export const dynamic = 'force-dynamic';

/**
 * Database connectivity health check.
 *
 * Probes a deliberately non-existent table. A structured PostgREST
 * "table not found" error proves the URL and key are valid; other errors
 * pinpoint what is misconfigured.
 */
export async function GET() {
  try {
    const supabase = getSupabaseClient();

    const { error } = await supabase
      .from('__connection_check__')
      .select('*')
      .limit(1);

    // No error, or "table not found" → connection and key are valid.
    if (!error || error.code === '42P01' || error.code === 'PGRST205') {
      return NextResponse.json({ ok: true });
    }

    const message = error.message ?? '';
    let reason: 'auth' | 'network' | 'unknown' = 'unknown';
    if (/api key|jwt|unauthorized/i.test(message)) {
      reason = 'auth';
    } else if (/fetch failed|network|enotfound|econnrefused/i.test(message)) {
      reason = 'network';
    }

    return NextResponse.json(
      { ok: false, reason, error: message },
      { status: 500 },
    );
  } catch (err) {
    // Thrown errors are missing env vars, a bad URL, or a network failure.
    const message = err instanceof Error ? err.message : String(err);
    const reason = /environment variable/i.test(message) ? 'config' : 'network';
    return NextResponse.json({ ok: false, reason, error: message }, { status: 500 });
  }
}
