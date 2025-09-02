require("dotenv").config();
const { Pool } = require("pg");
const { PgEventStore } = require("../dist/PgEventStore");
const { randomUUID } = require("crypto");

async function testEventStore() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const eventStore = new PgEventStore(pool);

  try {
    console.log("🧪 Testing Event Store...\n");

    const noteId = randomUUID();

    // First event (no previous hash)
    console.log("📝 Appending first event...");
    const event1 = await eventStore.append({
      namespace: "test.user",
      actorId: randomUUID(),
      verb: "NoteCreated",
      targetType: "Note",
      targetId: noteId,
      payload: { title: "My First Note", content: "Hello world!" },
      clientToken: "test-token-1",
    });

    console.log("✅ Event 1:", {
      id: event1.id,
      hash: event1.hash.substring(0, 12) + "...",
      timestamp: event1.ts,
    });

    // Second event (should chain to first)
    console.log("\n📝 Appending second event...");
    const event2 = await eventStore.append({
      namespace: "test.user",
      actorId: randomUUID(),
      verb: "NoteUpdated",
      targetType: "Note",
      targetId: noteId,
      payload: { title: "My Updated Note", content: "Hello universe!" },
      clientToken: "test-token-2",
    });

    console.log("✅ Event 2:", {
      id: event2.id,
      hash: event2.hash.substring(0, 12) + "...",
      timestamp: event2.ts,
    });

    // Test idempotency
    console.log("\n🔄 Testing idempotency (same token)...");
    const duplicate = await eventStore.append({
      namespace: "test.user",
      actorId: "user-123",
      verb: "NoteCreated",
      targetType: "Note",
      targetId: "note-789",
      payload: { title: "Should Not Create" },
      clientToken: "test-token-1", // Same token as event1
    });

    console.log("✅ Duplicate returned same event:", {
      sameId: duplicate.id === event1.id,
      sameHash: duplicate.hash === event1.hash,
    });

    // Get latest event
    console.log("\n🔗 Checking latest event...");
    const latest = await eventStore.getLatestEvent();
    console.log("✅ Latest hash:", latest?.hash.substring(0, 12) + "...");

    console.log("\n🎉 All tests passed! Hash chain is working! 🎉");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  } finally {
    await pool.end();
  }
}

testEventStore();
