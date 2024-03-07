/*
  Warnings:

  - A unique constraint covering the columns `[channelId,userId]` on the table `ChannelMember` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ChannelMember_channelId_userId_key" ON "ChannelMember"("channelId", "userId");
