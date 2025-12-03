-- CreateTable
CREATE TABLE "EquipmentSet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "playerId" TEXT NOT NULL,
    "setNumber" INTEGER NOT NULL,
    "name" TEXT,
    "gearImageUrl" TEXT,
    "armamentImageUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "EquipmentSet_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "EquipmentSet_playerId_setNumber_key" ON "EquipmentSet"("playerId", "setNumber");
