-- Unique indexes to enforce one vote per session/user per poll
-- Safe: no system table modifications.

CREATE UNIQUE INDEX IF NOT EXISTS votes_unique_session ON votes(poll_id, voter_session_id);
CREATE UNIQUE INDEX IF NOT EXISTS votes_unique_user ON votes(poll_id, user_id) WHERE user_id IS NOT NULL;
-- Optional: remove placeholder dummy unique index (not needed anymore)
DROP INDEX IF EXISTS votes_dummy_unique_workaround;
