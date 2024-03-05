-- CreateTable
CREATE TABLE "GameHistory" (
    "id" TEXT NOT NULL,
    "playedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "WinningUserId" TEXT NOT NULL,
    "WinningUserScore" INTEGER NOT NULL,
    "LosingUserId" TEXT NOT NULL,
    "LosingUserScore" INTEGER NOT NULL,

    CONSTRAINT "GameHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GameHistory_id_key" ON "GameHistory"("id");

-- AddForeignKey
ALTER TABLE "GameHistory" ADD CONSTRAINT "GameHistory_WinningUserId_fkey" FOREIGN KEY ("WinningUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameHistory" ADD CONSTRAINT "GameHistory_LosingUserId_fkey" FOREIGN KEY ("LosingUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
