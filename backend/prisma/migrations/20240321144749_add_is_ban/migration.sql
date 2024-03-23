/*
  Warnings:

  - You are about to drop the column `muteEnd` on the `ChannelMember` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ChannelMember" DROP COLUMN "muteEnd",
ADD COLUMN     "isBan" BOOLEAN NOT NULL DEFAULT false;
