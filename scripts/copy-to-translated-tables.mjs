// Script: Copy data from original tables to Translated tables (local SQLite)
import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const adapter = new PrismaLibSql({ url: 'file:./prisma/dev.db' });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Copying Class -> ClassTranslated...');
  const classResult = await prisma.$executeRaw`
    INSERT OR REPLACE INTO "ClassTranslated" ("id", "name", "description", "ageRange", "createdAt", "updatedAt")
    SELECT "id", "name", "description", "ageRange", "createdAt", "updatedAt" FROM "Class"
  `;
  console.log(`  Copied ${classResult} rows.`);

  console.log('Copying Student -> StudentTranslated...');
  const studentResult = await prisma.$executeRaw`
    INSERT OR REPLACE INTO "StudentTranslated"
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
  `;
  console.log(`  Copied ${studentResult} rows.`);

  console.log('Copying StudentProgress -> StudentProgressTranslated...');
  const progressResult = await prisma.$executeRaw`
    INSERT OR REPLACE INTO "StudentProgressTranslated"
      ("id", "studentId", "subcategoryId", "level", "completed", "plan", "createdAt", "updatedAt")
    SELECT
      "id", "studentId", "subcategoryId", "level", "completed", "plan", "createdAt", "updatedAt"
    FROM "StudentProgress"
  `;
  console.log(`  Copied ${progressResult} rows.`);

  console.log('\nDone! All data copied successfully.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
