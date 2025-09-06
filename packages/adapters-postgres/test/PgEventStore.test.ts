import { describe, test, expect, beforeEach, afterAll } from "vitest";
import { Pool } from "pg";
import { PgEventStore } from "../src/PgEventStore";
import { randomUUID } from "crypto";

const testPool = new Pool({
  connectionString: "postgresql://localhost:5432/omnilith_test", //TODO: Don't harcode
});

const eventStore = new PgEventStore(testPool);

describe("PgEventStore", () => {
  beforeEach(async () => {
    // Clean up test data before each test
    await testPool.query("DELETE FROM event_log WHERE namespace LIKE $1", [
      "test.%",
    ]);
  });

  afterAll(async () => {
    await testPool.end();
  });

  test("should append first event with null prev_hash", async () => {
    const result = await eventStore.append({
      namespace: "test.unit",
      actorId: randomUUID(),
      verb: "TestEvent",
      targetType: "Test",
      targetId: randomUUID(),
      payload: { message: "hello" },
    });

    expect(result.id).toBeDefined();
    expect(result.hash).toBeDefined();
    expect(result.ts).toBeDefined();

    // Check database directly
    const dbResult = await testPool.query(
      "SELECT prev_hash FROM event_log WHERE id = $1",
      [result.id]
    );
    expect(dbResult.rows[0].prev_hash).toBeNull();
  });

  test("should chain second event to first", async () => {
    const event1 = await eventStore.append({
      namespace: "test.chain",
      actorId: randomUUID(),
      verb: "FirstEvent",
      targetType: "Test",
      targetId: randomUUID(),
      payload: { order: 1 },
    });

    const event2 = await eventStore.append({
      namespace: "test.chain",
      actorId: randomUUID(),
      verb: "SecondEvent",
      targetType: "Test",
      targetId: randomUUID(),
      payload: { order: 2 },
    });

    // Second event should chain to first
    const dbResult = await testPool.query(
      "SELECT prev_hash FROM event_log WHERE id = $1",
      [event2.id]
    );
    expect(dbResult.rows[0].prev_hash).toBe(event1.hash);
  });

  test("should handle idempotency correctly", async () => {
    const clientToken = "test-idempotent-123";

    const result1 = await eventStore.append({
      namespace: "test.idempotent",
      actorId: randomUUID(),
      verb: "IdempotentEvent",
      targetType: "Test",
      targetId: randomUUID(),
      payload: { attempt: 1 },
      clientToken,
    });

    const result2 = await eventStore.append({
      namespace: "test.different", // Different data
      actorId: randomUUID(),
      verb: "DifferentEvent",
      targetType: "Different",
      targetId: randomUUID(),
      payload: { attempt: 2 },
      clientToken, // Same token!
    });

    // Should return identical results
    expect(result2.id).toBe(result1.id);
    expect(result2.hash).toBe(result1.hash);
    expect(result2.ts).toBe(result1.ts);
  });

  test("getLatestEvent should return most recent hash", async () => {
    // No events initially
    const empty = await eventStore.getLatestEvent();
    expect(empty).toBeNull();

    // Add an event
    const event = await eventStore.append({
      namespace: "test.latest",
      actorId: randomUUID(),
      verb: "LatestTest",
      targetType: "Test",
      targetId: randomUUID(),
      payload: { test: true },
    });

    // Should return the hash
    const latest = await eventStore.getLatestEvent();
    expect(latest).toEqual({ hash: event.hash });
  });
});
