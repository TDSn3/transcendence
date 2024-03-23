/*
  Warnings:

  - You are about to drop the `ChatSocket` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ChatSocket" DROP CONSTRAINT "ChatSocket_channelMemberId_fkey";

-- DropTable
DROP TABLE "ChatSocket";
