// One-time script to create translation tables on Turso
import { createClient } from '@libsql/client';
import 'dotenv/config';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function main() {
  // Check if tables already exist
  const tables = await client.execute(
    "SELECT name FROM sqlite_master WHERE type='table' AND name IN ('ClassTranslation', 'StudentTranslation', 'StudentProgressTranslation')"
  );

  if (tables.rows.length === 3) {
    console.log('All translation tables already exist on Turso. Nothing to do.');
    process.exit(0);
  }

  console.log(`Found ${tables.rows.length}/3 translation tables. Creating missing ones...`);

  // Create ClassTranslation
  await client.execute(`
    CREATE TABLE IF NOT EXISTS "ClassTranslation" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "classId" TEXT NOT NULL,
      "name" TEXT NOT NULL,
      "description" TEXT,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL,
      CONSTRAINT "ClassTranslation_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    )
  `);
  console.log('Created ClassTranslation table');

  // Create unique index
  await client.execute(`
    CREATE UNIQUE INDEX IF NOT EXISTS "ClassTranslation_classId_key" ON "ClassTranslation"("classId")
  `);

  // Create StudentTranslation
  await client.execute(`
    CREATE TABLE IF NOT EXISTS "StudentTranslation" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "studentId" TEXT NOT NULL,
      "firstName" TEXT NOT NULL,
      "lastName" TEXT NOT NULL,
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
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL,
      CONSTRAINT "StudentTranslation_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    )
  `);
  console.log('Created StudentTranslation table');

  await client.execute(`
    CREATE UNIQUE INDEX IF NOT EXISTS "StudentTranslation_studentId_key" ON "StudentTranslation"("studentId")
  `);

  // Create StudentProgressTranslation
  await client.execute(`
    CREATE TABLE IF NOT EXISTS "StudentProgressTranslation" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "progressId" TEXT NOT NULL,
      "plan" TEXT,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL,
      CONSTRAINT "StudentProgressTranslation_progressId_fkey" FOREIGN KEY ("progressId") REFERENCES "StudentProgress" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    )
  `);
  console.log('Created StudentProgressTranslation table');

  await client.execute(`
    CREATE UNIQUE INDEX IF NOT EXISTS "StudentProgressTranslation_progressId_key" ON "StudentProgressTranslation"("progressId")
  `);

  console.log('All translation tables created successfully on Turso!');
}

main().catch(console.error).finally(() => process.exit(0));
