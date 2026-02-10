// One-time script: create Translated tables on Turso and copy data from originals
import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function main() {
  // --- Create tables ---
  console.log('Creating ClassTranslated table...');
  await client.execute(`
    CREATE TABLE IF NOT EXISTS "ClassTranslated" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "name" TEXT NOT NULL,
      "description" TEXT,
      "ageRange" TEXT,
      "createdAt" DATETIME NOT NULL,
      "updatedAt" DATETIME NOT NULL
    )
  `);

  console.log('Creating StudentTranslated table...');
  await client.execute(`
    CREATE TABLE IF NOT EXISTS "StudentTranslated" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "firstName" TEXT NOT NULL,
      "lastName" TEXT NOT NULL,
      "dateOfBirth" DATETIME NOT NULL,
      "classId" TEXT NOT NULL,
      "diagnoses" TEXT NOT NULL DEFAULT '[]',
      "strengths" TEXT NOT NULL DEFAULT '[]',
      "challenges" TEXT NOT NULL DEFAULT '[]',
      "interests" TEXT NOT NULL DEFAULT '[]',
      "sensoryNeeds" TEXT NOT NULL DEFAULT '[]',
      "communicationStyle" TEXT NOT NULL DEFAULT '',
      "supportStrategies" TEXT NOT NULL DEFAULT '[]',
      "triggers" TEXT NOT NULL DEFAULT '[]',
      "calmingStrategies" TEXT NOT NULL DEFAULT '[]',
      "teacherNotes" TEXT NOT NULL DEFAULT '',
      "createdAt" DATETIME NOT NULL,
      "updatedAt" DATETIME NOT NULL
    )
  `);

  console.log('Creating StudentProgressTranslated table...');
  await client.execute(`
    CREATE TABLE IF NOT EXISTS "StudentProgressTranslated" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "studentId" TEXT NOT NULL,
      "subcategoryId" TEXT NOT NULL,
      "level" INTEGER NOT NULL DEFAULT 0,
      "completed" BOOLEAN NOT NULL DEFAULT 0,
      "plan" TEXT,
      "createdAt" DATETIME NOT NULL,
      "updatedAt" DATETIME NOT NULL
    )
  `);
  await client.execute(`
    CREATE UNIQUE INDEX IF NOT EXISTS "StudentProgressTranslated_studentId_subcategoryId_key"
    ON "StudentProgressTranslated"("studentId", "subcategoryId")
  `);

  console.log('All tables created.\n');

  // --- Copy data ---
  console.log('Copying Class -> ClassTranslated...');
  const classResult = await client.execute(`
    INSERT OR IGNORE INTO "ClassTranslated" ("id", "name", "description", "ageRange", "createdAt", "updatedAt")
    SELECT "id", "name", "description", "ageRange", "createdAt", "updatedAt" FROM "Class"
  `);
  console.log(`  Copied ${classResult.rowsAffected} rows.`);

  console.log('Copying Student -> StudentTranslated...');
  const studentResult = await client.execute(`
    INSERT OR IGNORE INTO "StudentTranslated"
      ("id", "firstName", "lastName", "dateOfBirth", "classId",
       "diagnoses", "strengths", "challenges", "interests", "sensoryNeeds",
       "communicationStyle", "supportStrategies", "triggers", "calmingStrategies", "teacherNotes",
       "createdAt", "updatedAt")
    SELECT
      "id", "firstName", "lastName", "dateOfBirth", "classId",
      "diagnoses", "strengths", "challenges", "interests", "sensoryNeeds",
      "communicationStyle", "supportStrategies", "triggers", "calmingStrategies", "teacherNotes",
      "createdAt", "updatedAt"
    FROM "Student"
  `);
  console.log(`  Copied ${studentResult.rowsAffected} rows.`);

  console.log('Copying StudentProgress -> StudentProgressTranslated...');
  const progressResult = await client.execute(`
    INSERT OR IGNORE INTO "StudentProgressTranslated"
      ("id", "studentId", "subcategoryId", "level", "completed", "plan", "createdAt", "updatedAt")
    SELECT
      "id", "studentId", "subcategoryId", "level", "completed", "plan", "createdAt", "updatedAt"
    FROM "StudentProgress"
  `);
  console.log(`  Copied ${progressResult.rowsAffected} rows.`);

  console.log('\nDone! All data copied successfully.');
}

main().catch(console.error).finally(() => process.exit(0));
