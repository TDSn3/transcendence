/*
  Warnings:

  - You are about to drop the column `description` on the `Channel` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Channel` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Channel" DROP COLUMN "description",
DROP COLUMN "type",
ADD COLUMN     "password" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "private" BOOLEAN NOT NULL DEFAULT false;

-- DropEnum
DROP TYPE "ChannelType";
