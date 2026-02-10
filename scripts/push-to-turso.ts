// Script to sync schema to Turso WITHOUT destroying existing data.
// Only adds missing tables and columns. Does NOT drop or overwrite anything.
//
// Usage:
//   npx tsx scripts/push-to-turso.ts          # safe schema sync (default)
//   npx tsx scripts/push-to-turso.ts --seed    # schema sync + upsert seed data
//   npx tsx scripts/push-to-turso.ts --reset   # DESTRUCTIVE: drop everything & rebuild from local DB
//
// Run with env vars loaded:
//   source <(grep = .env.local | sed 's/^/export /') && npx tsx scripts/push-to-turso.ts

import { createClient, type Client } from '@libsql/client';
import { execSync } from 'child_process';

const TURSO_URL = process.env.TURSO_DATABASE_URL;
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN;

if (!TURSO_URL || !TURSO_TOKEN) {
  console.error('Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN in environment.');
  console.error('Make sure .env.local is loaded or pass env vars directly.');
  process.exit(1);
}

const args = process.argv.slice(2);
const MODE = args.includes('--reset') ? 'reset' : args.includes('--seed') ? 'seed' : 'sync';

// ─── Helpers ──────────────────────────────────────────────────────────────────

interface ColumnInfo {
  name: string;
  type: string;
  notnull: number;
  dflt_value: string | null;
}

async function getRemoteTables(client: Client): Promise<string[]> {
  const res = await client.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_litestream%'");
  return res.rows.map(r => r.name as string);
}

async function getRemoteColumns(client: Client, table: string): Promise<ColumnInfo[]> {
  const res = await client.execute(`PRAGMA table_info("${table}")`);
  return res.rows.map(r => ({
    name: r.name as string,
    type: r.type as string,
    notnull: r.notnull as number,
    dflt_value: r.dflt_value as string | null,
  }));
}

function getLocalColumns(table: string): ColumnInfo[] {
  const raw = execSync(`sqlite3 prisma/dev.db "PRAGMA table_info('${table}');"`)
    .toString()
    .trim();
  if (!raw) return [];
  return raw.split('\n').map(line => {
    const parts = line.split('|');
    return {
      name: parts[1],
      type: parts[2],
      notnull: parseInt(parts[3]),
      dflt_value: parts[4] || null,
    };
  });
}

function getLocalTables(): string[] {
  const raw = execSync(`sqlite3 prisma/dev.db "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';"`)
    .toString()
    .trim();
  if (!raw) return [];
  return raw.split('\n');
}

function getLocalCreateTable(table: string): string | null {
  const raw = execSync(`sqlite3 prisma/dev.db "SELECT sql FROM sqlite_master WHERE type='table' AND name='${table}';"`)
    .toString()
    .trim();
  return raw || null;
}

function getLocalIndexes(table: string): string[] {
  const raw = execSync(`sqlite3 prisma/dev.db "SELECT sql FROM sqlite_master WHERE type='index' AND tbl_name='${table}' AND sql IS NOT NULL;"`)
    .toString()
    .trim();
  if (!raw) return [];
  return raw.split('\n').filter(s => s.length > 0);
}

// ─── Safe Schema Sync ─────────────────────────────────────────────────────────

async function syncSchema(client: Client) {
  console.log('\n📋 Syncing schema (safe — no data loss)...\n');

  const localTables = getLocalTables();
  const remoteTables = await getRemoteTables(client);

  let changes = 0;

  for (const table of localTables) {
    if (!remoteTables.includes(table)) {
      // Table doesn't exist remotely — create it
      const createSQL = getLocalCreateTable(table);
      if (createSQL) {
        console.log(`  ✚ Creating table "${table}"`);
        await client.execute(createSQL);
        changes++;

        // Also create any indexes for this table
        const indexes = getLocalIndexes(table);
        for (const idx of indexes) {
          try {
            await client.execute(idx);
            console.log(`    ✚ Created index for "${table}"`);
            changes++;
          } catch {
            // Index might reference columns that don't match — skip
          }
        }
      }
    } else {
      // Table exists — check for missing columns
      const localCols = getLocalColumns(table);
      const remoteCols = await getRemoteColumns(client, table);
      const remoteColNames = new Set(remoteCols.map(c => c.name));

      for (const col of localCols) {
        if (!remoteColNames.has(col.name)) {
          const defaultClause = col.dflt_value ? ` DEFAULT ${col.dflt_value}` : '';
          const nullClause = col.notnull ? ' NOT NULL' : '';
          // SQLite ALTER TABLE ADD COLUMN can't have NOT NULL without a default
          const safeNull = col.notnull && !col.dflt_value ? '' : nullClause;
          const sql = `ALTER TABLE "${table}" ADD COLUMN "${col.name}" ${col.type}${safeNull}${defaultClause}`;
          console.log(`  ✚ Adding column "${table}"."${col.name}" (${col.type})`);
          try {
            await client.execute(sql);
            changes++;
          } catch (e: any) {
            console.error(`    ✗ Failed: ${e.message}`);
          }
        }
      }

      // Check for missing indexes
      const indexes = getLocalIndexes(table);
      for (const idx of indexes) {
        try {
          // Use IF NOT EXISTS to avoid errors
          const safeIdx = idx.replace(/^CREATE (UNIQUE )?INDEX/, 'CREATE $1INDEX IF NOT EXISTS');
          await client.execute(safeIdx);
        } catch {
          // Skip if already exists or any other issue
        }
      }
    }
  }

  if (changes === 0) {
    console.log('  ✓ Schema is already up to date!');
  } else {
    console.log(`\n  ✓ Applied ${changes} schema change(s).`);
  }
}

// ─── Seed Data (upsert — won't overwrite existing) ───────────────────────────

async function seedData(client: Client) {
  console.log('\n🌱 Upserting seed data (won\'t overwrite existing records)...\n');

  const dump = execSync('sqlite3 prisma/dev.db ".dump"').toString();
  const statements = dump
    .split(/;\s*\n/)
    .map(s => s.trim())
    .filter(s => s.startsWith('INSERT'));

  // Convert INSERT INTO to INSERT OR IGNORE INTO (skip existing rows)
  const safeInserts = statements.map(sql => {
    // Process unistr() calls
    let processed = sql;
    if (processed.includes('unistr(')) {
      processed = processed.replace(/unistr\('((?:[^'\\]|\\.|'')*)'\)/g, (_, content) => {
        const decoded = content
          .replace(/\\u000a/gi, '\n')
          .replace(/\\u000d/gi, '\r')
          .replace(/\\u0009/gi, '\t')
          .replace(/''/g, "''");
        return `'${decoded}'`;
      });
    }
    return processed.replace(/^INSERT INTO/, 'INSERT OR IGNORE INTO');
  });

  let inserted = 0;
  let skipped = 0;

  for (const sql of safeInserts) {
    try {
      const result = await client.execute(sql + ';');
      if (result.rowsAffected > 0) {
        inserted += result.rowsAffected;
      } else {
        skipped++;
      }
    } catch (e: any) {
      // Skip _prisma_migrations or any other errors
      if (!sql.includes('_prisma_migrations')) {
        console.error(`  ✗ ${sql.substring(0, 60)}... — ${e.message}`);
      }
    }
  }

  console.log(`  ✓ Inserted ${inserted} new rows, skipped ${skipped} existing.`);
}

// ─── Destructive Reset ───────────────────────────────────────────────────────

async function destructiveReset(client: Client) {
  console.log('\n⚠️  DESTRUCTIVE RESET — dropping all tables and rebuilding from local DB...\n');

  const dump = execSync('sqlite3 prisma/dev.db ".dump"').toString();
  const statements = dump
    .split(/;\s*\n/)
    .map(s => s.trim())
    .filter(s => s.length > 0)
    .filter(s => !s.startsWith('PRAGMA'))
    .filter(s => !s.startsWith('BEGIN'))
    .filter(s => !s.startsWith('COMMIT'));

  const tableOrder = ['CustomCard', 'Lesson', 'StudentProgress', 'Student', 'Class', '_prisma_migrations'];

  // Drop all tables (reverse dependency order)
  console.log('  Dropping tables...');
  for (const table of tableOrder) {
    try {
      await client.execute(`DROP TABLE IF EXISTS "${table}"`);
    } catch {
      // ignore
    }
  }

  const createStmts = statements.filter(s => s.startsWith('CREATE TABLE') || s.startsWith('CREATE UNIQUE') || s.startsWith('CREATE INDEX'));
  const insertStmts = statements.filter(s => s.startsWith('INSERT')).map(sql => {
    if (sql.includes('unistr(')) {
      return sql.replace(/unistr\('((?:[^'\\]|\\.|'')*)'\)/g, (_, content) => {
        const decoded = content
          .replace(/\\u000a/gi, '\n')
          .replace(/\\u000d/gi, '\r')
          .replace(/\\u0009/gi, '\t')
          .replace(/''/g, "''");
        return `'${decoded}'`;
      });
    }
    return sql;
  });

  let success = 0;
  let failed = 0;

  for (const sql of [...createStmts, ...insertStmts]) {
    try {
      await client.execute(sql + ';');
      success++;
      if (sql.startsWith('CREATE TABLE')) {
        const table = sql.match(/CREATE TABLE "(\w+)"/)?.[1] || '?';
        console.log(`  ✚ Created "${table}"`);
      }
    } catch (e: any) {
      failed++;
      console.error(`  ✗ ${sql.substring(0, 60)}... — ${e.message}`);
    }
  }

  console.log(`\n  Done: ${success} succeeded, ${failed} failed.`);
}

// ─── Verify ──────────────────────────────────────────────────────────────────

async function verify(client: Client) {
  console.log('\n📊 Verifying data...\n');
  const tables = await getRemoteTables(client);
  for (const table of tables.filter(t => t !== '_prisma_migrations' && t !== '_litestream_seq')) {
    try {
      const res = await client.execute(`SELECT COUNT(*) as count FROM "${table}"`);
      const cols = await getRemoteColumns(client, table);
      console.log(`  ${table}: ${res.rows[0].count} rows, ${cols.length} columns (${cols.map(c => c.name).join(', ')})`);
    } catch {
      console.log(`  ${table}: (could not query)`);
    }
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const client = createClient({ url: TURSO_URL!, authToken: TURSO_TOKEN! });

  try {
    await client.execute('SELECT 1');
    console.log('✓ Connected to Turso');
  } catch (e) {
    console.error('✗ Failed to connect to Turso:', e);
    process.exit(1);
  }

  if (MODE === 'reset') {
    const readline = await import('readline');
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const answer = await new Promise<string>(resolve => {
      rl.question('\n⚠️  This will DELETE ALL DATA in Turso and replace it with local DB. Type "yes" to confirm: ', resolve);
    });
    rl.close();
    if (answer.trim().toLowerCase() !== 'yes') {
      console.log('Aborted.');
      process.exit(0);
    }
    await destructiveReset(client);
  } else {
    await syncSchema(client);
    if (MODE === 'seed') {
      await seedData(client);
    }
  }

  await verify(client);
  client.close();
}

main().catch(console.error);
