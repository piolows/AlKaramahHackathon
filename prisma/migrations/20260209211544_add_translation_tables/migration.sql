/*
  Warnings:

  - You are about to drop the column `goalVisuals` on the `StudentProgress` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "ClassTranslation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "classId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ClassTranslation_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StudentTranslation" (
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
);

-- CreateTable
CREATE TABLE "StudentProgressTranslation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "progressId" TEXT NOT NULL,
    "plan" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "StudentProgressTranslation_progressId_fkey" FOREIGN KEY ("progressId") REFERENCES "StudentProgress" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_StudentProgress" (
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
INSERT INTO "new_StudentProgress" ("completed", "createdAt", "id", "level", "plan", "studentId", "subcategoryId", "updatedAt") SELECT "completed", "createdAt", "id", "level", "plan", "studentId", "subcategoryId", "updatedAt" FROM "StudentProgress";
DROP TABLE "StudentProgress";
ALTER TABLE "new_StudentProgress" RENAME TO "StudentProgress";
CREATE UNIQUE INDEX "StudentProgress_studentId_subcategoryId_key" ON "StudentProgress"("studentId", "subcategoryId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "ClassTranslation_classId_key" ON "ClassTranslation"("classId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentTranslation_studentId_key" ON "StudentTranslation"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentProgressTranslation_progressId_key" ON "StudentProgressTranslation"("progressId");
