/*
  Warnings:

  - You are about to drop the `ClassTranslation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StudentProgressTranslation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StudentTranslation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ClassTranslation";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "StudentProgressTranslation";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "StudentTranslation";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "ClassTranslated" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "ageRange" TEXT,
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "StudentTranslated" (
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
);

-- CreateTable
CREATE TABLE "StudentProgressTranslated" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "subcategoryId" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "plan" TEXT,
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "StudentProgressTranslated_studentId_subcategoryId_key" ON "StudentProgressTranslated"("studentId", "subcategoryId");
