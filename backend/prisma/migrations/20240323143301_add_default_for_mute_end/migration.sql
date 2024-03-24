/*
  Warnings:

  - Made the column `muteEnd` on table `ChannelMember` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ChannelMember" ALTER COLUMN "muteEnd" SET NOT NULL,
ALTER COLUMN "muteEnd" SET DEFAULT CURRENT_TIMESTAMP;
