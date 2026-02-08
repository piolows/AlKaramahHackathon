// Script to push local SQLite data to Turso
// Run with: npx tsx scripts/push-to-turso.ts

import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';
import { execSync } from 'child_process';

const TURSO_URL = process.env.TURSO_DATABASE_URL;
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN;

if (!TURSO_URL || !TURSO_TOKEN) {
  console.error('Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN in environment.');
  console.error('Make sure .env.local is loaded.');
  process.exit(1);
}

async function main() {
  console.log('Connecting to Turso...');
  const client = createClient({
    url: TURSO_URL!,
    authToken: TURSO_TOKEN!,
  });

  // Test connection
  try {
    await client.execute('SELECT 1');
    console.log('Connected to Turso successfully!');
  } catch (e) {
    console.error('Failed to connect to Turso:', e);
    process.exit(1);
  }

  // Get the SQL dump from local SQLite
  console.log('Exporting local database...');
  const dump = execSync('sqlite3 prisma/dev.db ".dump"').toString();
  
  // Parse SQL statements (split on semicolons, but be careful with data)
  const statements = dump
    .split(/;\s*\n/)
    .map(s => s.trim())
    .filter(s => s.length > 0)
    .filter(s => !s.startsWith('PRAGMA'))
    .filter(s => !s.startsWith('BEGIN'))
    .filter(s => !s.startsWith('COMMIT'))
    .filter(s => !s.startsWith('DELETE FROM "_prisma_migrations"'));

  // Sort: CREATE TABLE first (in dependency order), then CREATE INDEX, then INSERTs (in dependency order)
  const tableOrder = ['Class', 'Student', 'StudentProgress', 'Lesson', 'CustomCard'];
  
  const createTableStmts = statements.filter(s => s.startsWith('CREATE TABLE'));
  const createIndexStmts = statements.filter(s => s.startsWith('CREATE UNIQUE') || s.startsWith('CREATE INDEX'));
  const insertStmts = statements.filter(s => s.startsWith('INSERT'));
  
  // Sort CREATE TABLEs by dependency order
  createTableStmts.sort((a, b) => {
    const tableA = tableOrder.findIndex(t => a.includes(`"${t}"`));
    const tableB = tableOrder.findIndex(t => b.includes(`"${t}"`));
    return (tableA === -1 ? 999 : tableA) - (tableB === -1 ? 999 : tableB);
  });
  
  // Sort INSERTs by dependency order
  insertStmts.sort((a, b) => {
    const tableA = tableOrder.findIndex(t => a.includes(`INTO ${t} `) || a.includes(`INTO "${t}" `));
    const tableB = tableOrder.findIndex(t => b.includes(`INTO ${t} `) || b.includes(`INTO "${b}" `));
    return (tableA === -1 ? 999 : tableA) - (tableB === -1 ? 999 : tableB);
  });
  
  // Process unistr() calls - convert \u000a to actual newlines, etc.
  const processedInserts = insertStmts.map(sql => {
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

  const sortedStatements = [...createTableStmts, ...createIndexStmts, ...processedInserts];

  console.log(`Found ${sortedStatements.length} SQL statements to execute.`);

  // Drop existing tables first (in reverse dependency order)
  console.log('Dropping existing tables...');
  const dropStatements = [
    'DROP TABLE IF EXISTS "Lesson"',
    'DROP TABLE IF EXISTS "StudentProgress"',
    'DROP TABLE IF EXISTS "Student"', 
    'DROP TABLE IF EXISTS "Class"',
    'DROP TABLE IF EXISTS "_prisma_migrations"',
  ];
  
  for (const sql of dropStatements) {
    try {
      await client.execute(sql);
    } catch (e) {
      // Ignore errors on drop
    }
  }

  // Execute each statement
  let success = 0;
  let failed = 0;
  
  for (const sql of sortedStatements) {
    try {
      await client.execute(sql + ';');
      success++;
      // Show progress for INSERT statements
      if (sql.startsWith('INSERT')) {
        const table = sql.match(/INSERT INTO (\w+)/)?.[1] || 'unknown';
        process.stdout.write(`\r  Inserted into ${table}... (${success} done)`);
      } else if (sql.startsWith('CREATE')) {
        const table = sql.match(/CREATE.*"(\w+)"/)?.[1] || 'unknown';
        console.log(`  Created table: ${table}`);
      }
    } catch (e: any) {
      failed++;
      console.error(`\n  Failed: ${sql.substring(0, 80)}...`);
      console.error(`  Error: ${e.message}`);
    }
  }

  console.log(`\n\nDone! ${success} succeeded, ${failed} failed.`);

  // Verify data
  console.log('\nVerifying data...');
  const classes = await client.execute('SELECT COUNT(*) as count FROM "Class"');
  const students = await client.execute('SELECT COUNT(*) as count FROM "Student"');
  const progress = await client.execute('SELECT COUNT(*) as count FROM "StudentProgress"');
  
  console.log(`  Classes: ${classes.rows[0].count}`);
  console.log(`  Students: ${students.rows[0].count}`);
  console.log(`  Progress records: ${progress.rows[0].count}`);

  client.close();
}

main().catch(console.error);
