/*
  Warnings:

  - You are about to drop the column `blocked` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "blocked";

-- CreateTable
CREATE TABLE "_UserBlock" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserBlock_AB_unique" ON "_UserBlock"("A", "B");

-- CreateIndex
CREATE INDEX "_UserBlock_B_index" ON "_UserBlock"("B");

-- AddForeignKey
ALTER TABLE "_UserBlock" ADD CONSTRAINT "_UserBlock_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserBlock" ADD CONSTRAINT "_UserBlock_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
