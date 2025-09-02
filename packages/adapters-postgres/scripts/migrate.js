require("dotenv").config();

const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function migrate() {
  const client = await pool.connect();

  try {
    // 1. Ensure migrations table exists
    await client.query(`
        CREATE TABLE IF NOT EXISTS migrations (
          filename TEXT PRIMARY KEY,
          applied_at TIMESTAMPTZ DEFAULT NOW()
        )
      `);

    // 2. Get list of completed migrations
    const { rows: completed } = await client.query(
      "SELECT filename FROM migrations ORDER BY filename"
    );
    const completedSet = new Set(completed.map((row) => row.filename));

    // 3. Get all migration files
    const migrationsDir = path.join(__dirname, "../migrations");
    const files = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith(".sql"))
      .sort();

    // 4. Run pending migrations
    for (const file of files) {
      if (completedSet.has(file)) {
        console.log(`Skipping ${file} (already applied)`);
        continue;
      }

      console.log(`Running ${file}...`);

      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, "utf8");

      await client.query("BEGIN");
      try {
        await client.query(sql);
        await client.query("INSERT INTO migrations (filename) VALUES ($1)", [
          file,
        ]);
        await client.query("COMMIT");
        console.log(`✓ ${file} applied successfully`);
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      }
    }

    console.log("All migrations completed!");
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch(console.error);
