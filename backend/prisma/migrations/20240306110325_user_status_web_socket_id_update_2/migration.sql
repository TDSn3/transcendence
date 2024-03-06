/*
  Warnings:

  - A unique constraint covering the columns `[webSocketId]` on the table `UserStatusWebSocketId` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserStatusWebSocketId_webSocketId_key" ON "UserStatusWebSocketId"("webSocketId");
