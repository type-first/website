const { sql } = require('@vercel/postgres');
const fs = require('fs').promises;
const path = require('path');

// Load environment variables from .env.local
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

async function runMigrations() {
  console.log('Starting database migrations...');
  
  try {
    // Create migrations table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    // Get list of executed migrations
    const executedMigrations = await sql`
      SELECT filename FROM migrations ORDER BY id
    `;
    const executedFiles = new Set(executedMigrations.rows.map(row => row.filename));

    // Read migration files
    const migrationsDir = path.join(__dirname, '../migrations');
    const files = await fs.readdir(migrationsDir);
    const migrationFiles = files
      .filter(file => file.endsWith('.sql'))
      .sort();

    console.log(`Found ${migrationFiles.length} migration files`);

    for (const file of migrationFiles) {
      if (executedFiles.has(file)) {
        console.log(`Skipping already executed migration: ${file}`);
        continue;
      }

      console.log(`Executing migration: ${file}`);
      
      const filePath = path.join(migrationsDir, file);
      const migrationSQL = await fs.readFile(filePath, 'utf-8');
      
      // Execute migration in a transaction
      await sql`BEGIN`;
      try {
        // Split by semicolon and execute each statement
        const statements = migrationSQL
          .split(';')
          .map(stmt => stmt.trim())
          .filter(stmt => stmt.length > 0);

        for (const statement of statements) {
          await sql.query(statement);
        }

        // Record migration as executed
        await sql`
          INSERT INTO migrations (filename) VALUES (${file})
        `;
        
        await sql`COMMIT`;
        console.log(`✅ Migration ${file} executed successfully`);
      } catch (error) {
        await sql`ROLLBACK`;
        throw error;
      }
    }

    console.log('✅ All migrations completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migrations if called directly
if (require.main === module) {
  runMigrations();
}

module.exports = { runMigrations };
