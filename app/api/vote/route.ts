import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { Client } from 'pg';
import crypto from 'crypto';

let _client: Client | null = null;
function getClient() {
  if (!_client) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error('DATABASE_URL missing');
    _client = new Client({ connectionString: url });
    _client.connect();
  }
  return _client;
}

function hash(value: string | undefined) {
  if (!value) return null;
  return crypto.createHash('sha256').update(value).digest('hex');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { pollSlug, choiceKey, countryCode, locale } = body as {
      pollSlug?: string;
      choiceKey?: string;
      countryCode?: string;
      locale?: string;
    };

    if (!pollSlug || !choiceKey) {
      return NextResponse.json({ error: 'pollSlug and choiceKey required' }, { status: 400 });
    }

    const client = getClient();

    const pollRow = await client.query('select id, status from polls where slug=$1', [pollSlug]);
    if (!pollRow.rows.length) return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
    if (pollRow.rows[0].status !== 'open') return NextResponse.json({ error: 'Poll not open' }, { status: 409 });
    const pollId = pollRow.rows[0].id as string;

    const choice = await client.query('select id from poll_choices where poll_id=$1 and key=$2', [pollId, choiceKey]);
    if (!choice.rows.length) return NextResponse.json({ error: 'Choice not found' }, { status: 404 });
    const choiceId = choice.rows[0].id as string;

    const cookieStore = await cookies();
    let sessionId = cookieStore.get('vsid')?.value;
    const resHeaders: Record<string, string> = {};
    if (!sessionId) {
      const newSession = await client.query('insert into voter_sessions (source) values ($1) returning id', ['guest']);
      sessionId = newSession.rows[0].id;
      resHeaders['Set-Cookie'] = `vsid=${sessionId}; Path=/; Max-Age=${60 * 60 * 24 * 365}; HttpOnly; SameSite=Lax`;
    } else {
      // Update the expiration date of the existing session cookie
      resHeaders['Set-Cookie'] = `vsid=${sessionId}; Path=/; Max-Age=${60 * 60 * 24 * 365}; HttpOnly; SameSite=Lax`;
    }

    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '';
    const ua = req.headers.get('user-agent') || '';
    const ipHash = hash(ip.split(',')[0].trim());
    const uaHash = hash(ua);

    // DUP CHECK (best-effort; real enforcement by unique index)
    const dup = await client.query('select 1 from votes where poll_id=$1 and voter_session_id=$2 limit 1', [pollId, sessionId]);
    if (dup.rows.length) {
      return new NextResponse(JSON.stringify({ error: 'Already voted' }), { status: 409, headers: { 'Content-Type': 'application/json', ...resHeaders } });
    }

    await client.query(
      `insert into votes (poll_id, choice_id, voter_session_id, source, country_code, locale, ip_hash, ua_hash)
       values ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [pollId, choiceId, sessionId, 'guest', countryCode || null, locale || null, ipHash, uaHash]
    );

    return new NextResponse(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json', ...resHeaders } });
  } catch (e: any) {
    if (e?.code === '23505') {
      return NextResponse.json({ error: 'Already voted' }, { status: 409 });
    }
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
