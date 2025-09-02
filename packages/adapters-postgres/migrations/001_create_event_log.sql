CREATE TABLE event_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ts TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    namespace TEXT NOT NULL,
    actor_id TEXT NOT NULL,
    verb TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id UUID NOT NULL,
    payload JSONB NOT NULL,
    prev_hash TEXT,
    hash TEXT NOT NULL,
    client_token TEXT
  );

  CREATE INDEX idx_event_log_ts ON event_log(ts);
  CREATE INDEX idx_event_log_client_token ON event_log(client_token) WHERE client_token IS NOT NULL;