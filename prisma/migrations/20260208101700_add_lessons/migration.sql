-- CreateTable
CREATE TABLE "Lesson" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "classId" TEXT NOT NULL,
    "curriculumArea" TEXT NOT NULL,
    "lessonTopic" TEXT NOT NULL,
    "learningObjective" TEXT NOT NULL,
    "additionalNotes" TEXT,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Lesson_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
    "teacherNotes" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Student_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Student" ("calmingStrategies", "challenges", "classId", "communicationStyle", "createdAt", "dateOfBirth", "diagnoses", "firstName", "id", "interests", "lastName", "sensoryNeeds", "strengths", "supportStrategies", "triggers", "updatedAt") SELECT "calmingStrategies", "challenges", "classId", "communicationStyle", "createdAt", "dateOfBirth", "diagnoses", "firstName", "id", "interests", "lastName", "sensoryNeeds", "strengths", "supportStrategies", "triggers", "updatedAt" FROM "Student";
DROP TABLE "Student";
ALTER TABLE "new_Student" RENAME TO "Student";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
