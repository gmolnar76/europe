import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';

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

// GET /api/results?pollSlug=eu-integration-scenarios
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const pollSlug = searchParams.get('pollSlug');
    if (!pollSlug) return NextResponse.json({ error: 'pollSlug required' }, { status: 400 });

    const client = getClient();
    // Fetch poll id
    const pollRow = await client.query('select id from polls where slug=$1', [pollSlug]);
    if (!pollRow.rows.length) return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
    const pollId = pollRow.rows[0].id as string;

    // Aggregate votes by choice and source
    const agg = await client.query(
      `select c.key as choice_key,
              v.source,
              count(*)::bigint as cnt
       from votes v
       join poll_choices c on c.id = v.choice_id
       where v.poll_id = $1
       group by 1,2
       order by 1,2`,
      [pollId]
    );

    // Total per choice (all sources)
    const totals = await client.query(
      `select c.key as choice_key, count(*)::bigint as total
       from votes v
       join poll_choices c on c.id = v.choice_id
       where v.poll_id = $1
       group by 1
       order by 1`,
      [pollId]
    );

    // Optional per country breakdown (future: filter by country list)
    const countries = await client.query(
      `select c.key as choice_key, v.country_code, count(*)::bigint as cnt
       from votes v
       join poll_choices c on c.id = v.choice_id
       where v.poll_id = $1 and v.country_code is not null
       group by 1,2
       order by 1,2`,
      [pollId]
    );

    return NextResponse.json({ pollId, pollSlug, bySource: agg.rows, totals: totals.rows, byCountry: countries.rows });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
