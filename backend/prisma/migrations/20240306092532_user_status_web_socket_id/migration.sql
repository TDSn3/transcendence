/*
  Warnings:

  - You are about to drop the column `webSocketId` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "webSocketId";

-- CreateTable
CREATE TABLE "UserStatusWebSocketId" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "webSocketId" TEXT NOT NULL,

    CONSTRAINT "UserStatusWebSocketId_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserStatusWebSocketId_id_key" ON "UserStatusWebSocketId"("id");

-- AddForeignKey
ALTER TABLE "UserStatusWebSocketId" ADD CONSTRAINT "UserStatusWebSocketId_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
