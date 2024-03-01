/*
  Warnings:

  - Made the column `password` on table `Channel` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `userId` on the `ChannelMember` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "ChannelMember" DROP CONSTRAINT "ChannelMember_userId_fkey";

-- AlterTable
ALTER TABLE "Channel" ALTER COLUMN "password" SET NOT NULL;

-- AlterTable
ALTER TABLE "ChannelMember" DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "ChannelMember" ADD CONSTRAINT "ChannelMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("intraId") ON DELETE RESTRICT ON UPDATE CASCADE;
