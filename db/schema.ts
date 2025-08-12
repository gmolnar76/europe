// Database schema (Drizzle ORM) – MVP for EUROPA.VOTE
// NOTE: Install packages before use:
// npm i drizzle-orm pg dotenv
// npm i -D drizzle-kit
// Then create drizzle.config.ts referencing this file.

import { pgTable, uuid, text, timestamp, integer, bigint, char, uniqueIndex } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// 1. Polls
export const polls = pgTable('polls', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').notNull().unique(),
  status: text('status').notNull().default('draft'), // draft | open | closed (enforced via CHECK below)
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
}, (t) => ({
  statusCheck: sql`CHECK (status IN ('draft','open','closed'))`
}));

// 2. Poll choices (3 main scenarios)
export const pollChoices = pgTable('poll_choices', {
  id: uuid('id').primaryKey().defaultRandom(),
  pollId: uuid('poll_id').notNull().references(() => polls.id, { onDelete: 'cascade' }),
  key: text('key').notNull(), // e.g. scenario_eu_states | scenario_use | scenario_ea_ez
  labelKey: text('label_key'), // optional i18n message key
  order: integer('order').notNull()
}, (t) => ({
  uniqPollKey: uniqueIndex('poll_choices_poll_key_uniq').on(t.pollId, t.key)
}));

// 3. Voter sessions (anonymous or registered linkage)
export const voterSessions = pgTable('voter_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id'), // future user table
  source: text('source').notNull(), // guest | registered (CHECK below)
  fingerprintHash: text('fingerprint_hash'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  lastSeenAt: timestamp('last_seen_at', { withTimezone: true })
}, (t) => ({
  sourceCheck: sql`CHECK (source IN ('guest','registered'))`
}));

// 4. Votes (append-only)
export const votes = pgTable('votes', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  pollId: uuid('poll_id').notNull().references(() => polls.id),
  choiceId: uuid('choice_id').notNull().references(() => pollChoices.id),
  voterSessionId: uuid('voter_session_id').notNull().references(() => voterSessions.id),
  userId: uuid('user_id'), // nullable for guest
  source: text('source').notNull(), // guest | registered
  countryCode: char('country_code', { length: 2 }),
  locale: text('locale'), // en | ru | ...
  ipHash: text('ip_hash'), // salted hash only
  uaHash: text('ua_hash'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
}, (t) => ({
  sourceCheck: sql`CHECK (source IN ('guest','registered'))`,
  // Regular indexes (Drizzle will create). Partial unique indexes handled via raw SQL migration (see below export).
  pollChoiceIdx: uniqueIndex('votes_dummy_unique_workaround').on(t.id) // placeholder: real unique partial indexes in raw SQL.
}));

// 5. Regions (metadata only; no geometry here)
export const regions = pgTable('regions', {
  countryCode: char('country_code', { length: 2 }).primaryKey(),
  nameEn: text('name_en').notNull(),
  nameRu: text('name_ru').notNull(),
  population: integer('population'),
  centroidLat: text('centroid_lat'), // keep as text or change to numeric(9,6) via raw SQL
  centroidLng: text('centroid_lng'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow()
});

// 6. Scenario region membership (for overlay groupings)
export const scenarioRegions = pgTable('scenario_regions', {
  scenarioKey: text('scenario_key').notNull(), // e.g. overlay_euroatlantic, overlay_eurasian
  countryCode: char('country_code', { length: 2 }).notNull().references(() => regions.countryCode)
}, (t) => ({
  pk: uniqueIndex('scenario_regions_pk').on(t.scenarioKey, t.countryCode)
}));

// Helper raw SQL (to place into a migration) for partial unique constraints + performance indexes.
export const extraSql = sql`
  -- Enforce single vote per user (registered) per poll
  CREATE UNIQUE INDEX IF NOT EXISTS votes_unique_user ON votes(poll_id, user_id) WHERE user_id IS NOT NULL;
  -- Enforce single vote per anonymous session per poll
  CREATE UNIQUE INDEX IF NOT EXISTS votes_unique_session ON votes(poll_id, voter_session_id) WHERE user_id IS NULL;
  -- Performance indexes
  CREATE INDEX IF NOT EXISTS votes_poll_choice_idx ON votes(poll_id, choice_id);
  CREATE INDEX IF NOT EXISTS votes_poll_source_idx ON votes(poll_id, source);
  CREATE INDEX IF NOT EXISTS votes_poll_country_source_idx ON votes(poll_id, country_code, source);
  CREATE INDEX IF NOT EXISTS votes_created_at_idx ON votes(created_at);
`;

// Optionally create materialized views later (add raw SQL migration):
// CREATE MATERIALIZED VIEW mv_choice_totals AS
//   SELECT poll_id, choice_id, source, count(*)::bigint AS cnt FROM votes GROUP BY 1,2,3;
// CREATE MATERIALIZED VIEW mv_country_choice_totals AS
//   SELECT poll_id, country_code, choice_id, source, count(*)::bigint AS cnt
//   FROM votes GROUP BY 1,2,3,4;
// (Add CONCURRENTLY refresh approach in an application job.)

// TODOs:
// - Add drizzle.config.ts referencing this file.
// - Generate migrations then inject extraSql in a custom migration file if drizzle-kit doesn't capture partial indexes.
