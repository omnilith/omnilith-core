import { Pool } from "pg";
import { EventStorePort, AppendEventData, EventResult } from "@omnilith/core";
import crypto from "crypto";

export class PgEventStore implements EventStorePort {
  constructor(private pool: Pool) {}

  async append(event: AppendEventData): Promise<EventResult> {
    const client = await this.pool.connect();

    try {
      await client.query("BEGIN");

      if (event.clientToken) {
        const existingResult = await client.query(
          "SELECT id, ts, hash FROM event_log WHERE client_token = $1",
          [event.clientToken]
        );

        if (existingResult.rows.length > 0) {
          await client.query("COMMIT");
          const existing = existingResult.rows[0];
          return {
            id: existing.id,
            ts: existing.ts.toISOString(),
            hash: existing.hash,
          };
        }
      }

      const prevResult = await client.query(
        "SELECT hash FROM event_log ORDER BY ts DESC LIMIT 1"
      );
      const prevHash =
        prevResult.rows.length > 0 ? prevResult.rows[0].hash : null;

      const hashData = `${prevHash || ""}|${event.namespace}|${event.verb}|${
        event.targetType
      }|${event.targetId}|${JSON.stringify(event.payload)}`;
      const hash = crypto.createHash("sha256").update(hashData).digest("hex");

      const insertResult = await client.query(
        `INSERT INTO event_log (
            namespace, actor_id, verb, target_type, target_id, 
            payload, prev_hash, hash, client_token
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          RETURNING id, ts, hash`,
        [
          event.namespace,
          event.actorId,
          event.verb,
          event.targetType,
          event.targetId,
          event.payload,
          prevHash,
          hash,
          event.clientToken || null,
        ]
      );

      await client.query("COMMIT");

      const result = insertResult.rows[0];
      return {
        id: result.id,
        ts: result.ts.toISOString(),
        hash: result.hash,
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async getLatestEvent(): Promise<{ hash: string } | null> {
    const client = await this.pool.connect();

    try {
      const result = await client.query(
        "SELECT hash FROM event_log ORDER BY ts DESC LIMIT 1"
      );

      return result.rows.length > 0 ? { hash: result.rows[0].hash } : null;
    } finally {
      client.release();
    }
  }
}
