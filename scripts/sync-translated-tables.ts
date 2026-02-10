// Script to sync ONLY the 3 translated tables from local dev.db to remote Turso.
// Tables: StudentTranslated, ClassTranslated, StudentProgressTranslated
//
// Usage:
//   source <(grep = .env.local | sed 's/^/export /') && npx tsx scripts/sync-translated-tables.ts

import { createClient } from '@libsql/client';
import { execSync } from 'child_process';

const TURSO_URL = process.env.TURSO_DATABASE_URL;
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN;

if (!TURSO_URL || !TURSO_TOKEN) {
  console.error('Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN in environment.');
  process.exit(1);
}

const TABLES = ['ClassTranslated', 'StudentTranslated', 'StudentProgressTranslated'];

function getLocalCreateTable(table: string): string | null {
  const raw = execSync(`sqlite3 prisma/dev.db "SELECT sql FROM sqlite_master WHERE type='table' AND name='${table}';"`)
    .toString()
    .trim();
  return raw || null;
}

function getLocalRows(table: string): string[] {
  // Dump INSERT statements for this specific table
  const dump = execSync(`sqlite3 prisma/dev.db ".dump '${table}'"`)
    .toString();
  
  return dump
    .split(/;\s*\n/)
    .map(s => s.trim())
    .filter(s => s.startsWith('INSERT'))
    .map(sql => {
      // Handle unistr() calls (SQLite 3.44+)
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
}

async function main() {
  const client = createClient({ url: TURSO_URL!, authToken: TURSO_TOKEN! });

  try {
    await client.execute('SELECT 1');
    console.log('✓ Connected to Turso\n');
  } catch (e) {
    console.error('✗ Failed to connect:', e);
    process.exit(1);
  }

  // Check which tables exist remotely
  const remoteTables = (await client.execute(
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
  )).rows.map(r => r.name as string);

  for (const table of TABLES) {
    console.log(`── ${table} ──`);

    // 1. Create table if it doesn't exist
    if (!remoteTables.includes(table)) {
      const createSQL = getLocalCreateTable(table);
      if (!createSQL) {
        console.log(`  ✗ Table not found locally, skipping.`);
        continue;
      }
      console.log(`  ✚ Creating table...`);
      await client.execute(createSQL);

      // Create indexes too
      const idxRaw = execSync(`sqlite3 prisma/dev.db "SELECT sql FROM sqlite_master WHERE type='index' AND tbl_name='${table}' AND sql IS NOT NULL;"`)
        .toString().trim();
      if (idxRaw) {
        for (const idx of idxRaw.split('\n').filter(s => s.length > 0)) {
          try { await client.execute(idx); } catch { /* skip */ }
        }
      }
    }

    // 2. Clear existing remote data
    console.log(`  🗑  Clearing remote data...`);
    const before = await client.execute(`SELECT COUNT(*) as c FROM "${table}"`);
    await client.execute(`DELETE FROM "${table}"`);
    console.log(`     Deleted ${before.rows[0].c} existing rows.`);

    // 3. Insert local data
    const inserts = getLocalRows(table);
    console.log(`  ⬆  Inserting ${inserts.length} rows from local DB...`);
    let ok = 0;
    for (const sql of inserts) {
      try {
        await client.execute(sql + ';');
        ok++;
      } catch (e: any) {
        console.error(`  ✗ Failed: ${e.message}`);
        console.error(`    SQL: ${sql.substring(0, 120)}...`);
      }
    }
    console.log(`  ✓ Inserted ${ok}/${inserts.length} rows.\n`);
  }

  // Verify
  console.log('── Verification ──');
  for (const table of TABLES) {
    try {
      const res = await client.execute(`SELECT COUNT(*) as c FROM "${table}"`);
      console.log(`  ${table}: ${res.rows[0].c} rows`);
    } catch {
      console.log(`  ${table}: (could not query)`);
    }
  }

  client.close();
  console.log('\n✓ Done!');
}

main().catch(console.error);
