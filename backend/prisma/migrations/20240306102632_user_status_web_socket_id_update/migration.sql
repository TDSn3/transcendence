/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `UserStatusWebSocketId` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserStatusWebSocketId_userId_key" ON "UserStatusWebSocketId"("userId");
