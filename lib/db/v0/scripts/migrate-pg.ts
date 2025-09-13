// moved to lib/db/scripts (TypeScript)
import { Client } from 'pg';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from project root .env.local
dotenv.config({ path: path.join(__dirname, '../../../.env.local') });

export async function runMigrations(): Promise<void> {
  console.log('Starting database migrations...');

  const client = new Client({
    connectionString: process.env.POSTGRES_URL,
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    const executedMigrations = await client.query(
      'SELECT filename FROM migrations ORDER BY id'
    );
    const executedFiles = new Set(
      (executedMigrations.rows as Array<{ filename: string }>).map((row) => row.filename)
    );

    const migrationsDir = path.join(__dirname, '../migrations');
    const files = await fs.readdir(migrationsDir);
    const migrationFiles = files.filter((file) => file.endsWith('.sql')).sort();

    console.log(`Found ${migrationFiles.length} migration files`);

    for (const file of migrationFiles) {
      if (executedFiles.has(file)) {
        console.log(`Skipping already executed migration: ${file}`);
        continue;
      }

      console.log(`Executing migration: ${file}`);
      const filePath = path.join(migrationsDir, file);
      const migrationSQL = await fs.readFile(filePath, 'utf-8');

      await client.query('BEGIN');
      try {
        await client.query(migrationSQL);
        await client.query('INSERT INTO migrations (filename) VALUES ($1)', [file]);
        await client.query('COMMIT');
        console.log(`✅ Migration ${file} executed successfully`);
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      }
    }

    console.log('✅ All migrations completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Execute when run directly
const invokedDirectly = process.argv[1]?.endsWith('migrate-pg.ts') || process.argv[1]?.endsWith('migrate-pg.js');
if (invokedDirectly) {
  runMigrations();
}
