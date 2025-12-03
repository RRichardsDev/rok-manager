-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_EventParticipation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "playerId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "participated" BOOLEAN NOT NULL DEFAULT false,
    "score" INTEGER,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "EventParticipation_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "EventParticipation_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_EventParticipation" ("createdAt", "eventId", "id", "notes", "participated", "playerId", "score", "updatedAt") SELECT "createdAt", "eventId", "id", "notes", "participated", "playerId", "score", "updatedAt" FROM "EventParticipation";
DROP TABLE "EventParticipation";
ALTER TABLE "new_EventParticipation" RENAME TO "EventParticipation";
CREATE UNIQUE INDEX "EventParticipation_playerId_eventId_key" ON "EventParticipation"("playerId", "eventId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
