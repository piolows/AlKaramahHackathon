/*
  Warnings:

  - You are about to drop the `AETGoal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Comment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `gradeLevel` on the `Class` table. All the data in the column will be lost.
  - You are about to drop the column `behaviors` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `profileImage` on the `Student` table. All the data in the column will be lost.
  - Made the column `dateOfBirth` on table `Student` required. This step will fail if there are existing NULL values in that column.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "AETGoal";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Comment";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "StudentProgress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "subcategoryId" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "plan" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "StudentProgress_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Class" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "ageRange" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Class" ("createdAt", "description", "id", "name", "updatedAt") SELECT "createdAt", "description", "id", "name", "updatedAt" FROM "Class";
DROP TABLE "Class";
ALTER TABLE "new_Class" RENAME TO "Class";
CREATE TABLE "new_Student" (
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Student_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Student" ("challenges", "classId", "communicationStyle", "createdAt", "dateOfBirth", "diagnoses", "firstName", "id", "lastName", "sensoryNeeds", "strengths", "updatedAt") SELECT coalesce("challenges", '[]') AS "challenges", "classId", coalesce("communicationStyle", '') AS "communicationStyle", "createdAt", "dateOfBirth", "diagnoses", "firstName", "id", "lastName", coalesce("sensoryNeeds", '[]') AS "sensoryNeeds", coalesce("strengths", '[]') AS "strengths", "updatedAt" FROM "Student";
DROP TABLE "Student";
ALTER TABLE "new_Student" RENAME TO "Student";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "StudentProgress_studentId_subcategoryId_key" ON "StudentProgress"("studentId", "subcategoryId");
