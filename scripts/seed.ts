import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import { polls, pollChoices, regions, scenarioRegions } from '../db/schema';

async function upsertPoll(client: Client, slug: string, status: string, choices: { key: string; label_key: string; order: number }[]) {
  const existing = await client.query('select id from polls where slug=$1', [slug]);
  let pollId: string;
  if (existing.rows.length) {
    pollId = existing.rows[0].id;
    console.log('Poll exists:', slug, pollId);
  } else {
    const ins = await client.query('insert into polls (slug,status) values ($1,$2) returning id', [slug, status]);
    pollId = ins.rows[0].id;
    console.log('Created poll:', slug, pollId);
  }
  for (const c of choices) {
    await client.query(
      `insert into poll_choices (poll_id, key, label_key, "order") values ($1,$2,$3,$4)
       on conflict (poll_id, key) do update set label_key=excluded.label_key, "order"=excluded."order"`,

      [pollId, c.key, c.label_key, c.order]
    );
  }
}

async function seedIntegrationScenarios(client: Client) {
  await upsertPoll(client, 'eu-integration-scenarios', 'open', [
    { key: 'scenario_eu_states', label_key: 'scenario.eu_states', order: 1 },
    { key: 'scenario_united_europe', label_key: 'scenario.united_europe', order: 2 },
    { key: 'scenario_ea_ez_overlay', label_key: 'scenario.ea_ez_overlay', order: 3 }
  ]);
}

async function seedLeadership(client: Client) {
  await upsertPoll(client, 'leadership-transnational-lists', 'open', [
    { key: 'yes', label_key: 'leadership.transnational.yes', order: 1 },
    { key: 'no', label_key: 'leadership.transnational.no', order: 2 },
    { key: 'unsure', label_key: 'leadership.transnational.unsure', order: 3 }
  ]);
  await upsertPoll(client, 'leadership-commission-selection', 'open', [
    { key: 'direct', label_key: 'leadership.commission.direct', order: 1 },
    { key: 'spitzen', label_key: 'leadership.commission.spitzen', order: 2 },
    { key: 'council', label_key: 'leadership.commission.council', order: 3 },
    { key: 'unsure', label_key: 'leadership.commission.unsure', order: 4 }
  ]);
  await upsertPoll(client, 'leadership-eu-referendum', 'open', [
    { key: 'support', label_key: 'leadership.referendum.support', order: 1 },
    { key: 'conditional', label_key: 'leadership.referendum.conditional', order: 2 },
    { key: 'oppose', label_key: 'leadership.referendum.oppose', order: 3 }
  ]);
}

async function seedMigration(client: Client) {
  await upsertPoll(client, 'migration-solidarity-mechanism', 'open', [
    { key: 'quota', label_key: 'migration.solidarity.quota', order: 1 },
    { key: 'financial', label_key: 'migration.solidarity.financial', order: 2 },
    { key: 'mixed', label_key: 'migration.solidarity.mixed', order: 3 },
    { key: 'unsure', label_key: 'migration.solidarity.unsure', order: 4 }
  ]);
  await upsertPoll(client, 'migration-skill-partnerships', 'open', [
    { key: 'yes', label_key: 'migration.skills.yes', order: 1 },
    { key: 'conditional', label_key: 'migration.skills.conditional', order: 2 },
    { key: 'no', label_key: 'migration.skills.no', order: 3 }
  ]);
  await upsertPoll(client, 'migration-host-standards', 'open', [
    { key: 'high', label_key: 'migration.standards.high', order: 1 },
    { key: 'basic', label_key: 'migration.standards.basic', order: 2 },
    { key: 'no', label_key: 'migration.standards.no', order: 3 }
  ]);
}

async function seedWho(client: Client) {
  await upsertPoll(client, 'who-stockpile', 'open', [
    { key: 'yes', label_key: 'who.stockpile.yes', order: 1 },
    { key: 'partial', label_key: 'who.stockpile.partial', order: 2 },
    { key: 'national', label_key: 'who.stockpile.national', order: 3 },
    { key: 'unsure', label_key: 'who.stockpile.unsure', order: 4 }
  ]);
  await upsertPoll(client, 'who-common-position', 'open', [
    { key: 'support', label_key: 'who.position.support', order: 1 },
    { key: 'conditional', label_key: 'who.position.conditional', order: 2 },
    { key: 'oppose', label_key: 'who.position.oppose', order: 3 }
  ]);
  await upsertPoll(client, 'who-genomic-sharing', 'open', [
    { key: 'yes', label_key: 'who.genomic.yes', order: 1 },
    { key: 'privacy', label_key: 'who.genomic.privacy', order: 2 },
    { key: 'no', label_key: 'who.genomic.no', order: 3 }
  ]);
}

async function seedRegionsAndScenarios(client: Client) {
  const regionData: { code: string; en: string; ru: string }[] = [
    { code: 'DE', en: 'Germany', ru: 'Германия' },
    { code: 'FR', en: 'France', ru: 'Франция' },
    { code: 'IT', en: 'Italy', ru: 'Италия' },
    { code: 'ES', en: 'Spain', ru: 'Испания' },
    { code: 'PL', en: 'Poland', ru: 'Польша' },
    { code: 'HU', en: 'Hungary', ru: 'Венгрия' }
  ];
  for (const r of regionData) {
    await client.query(
      `insert into regions (country_code, name_en, name_ru) values ($1,$2,$3)
       on conflict (country_code) do update set name_en=excluded.name_en, name_ru=excluded.name_ru`,
      [r.code, r.en, r.ru]
    );
  }
  await client.query(
    `insert into scenario_regions (scenario_key, country_code)
     select s.scenario_key, s.country_code from (values
       ('scenario_eu_states','DE'),('scenario_eu_states','FR'),('scenario_eu_states','IT'),('scenario_eu_states','ES'),('scenario_eu_states','PL'),('scenario_eu_states','HU'),
       ('scenario_united_europe','DE'),('scenario_united_europe','FR'),('scenario_united_europe','IT'),('scenario_united_europe','ES'),('scenario_united_europe','PL'),('scenario_united_europe','HU'),
       ('scenario_ea_ez_overlay','DE'),('scenario_ea_ez_overlay','FR'),('scenario_ea_ez_overlay','PL')
     ) as s(scenario_key,country_code)
     on conflict (scenario_key, country_code) do nothing`
  );
}

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL missing');
  const client = new Client({ connectionString: url });
  await client.connect();

  await seedIntegrationScenarios(client);
  await seedLeadership(client);
  await seedMigration(client);
  await seedWho(client);
  await seedRegionsAndScenarios(client);

  await client.end();
  console.log('Seed completed (all polls)');
}

main().catch(err => { console.error(err); process.exit(1); });
