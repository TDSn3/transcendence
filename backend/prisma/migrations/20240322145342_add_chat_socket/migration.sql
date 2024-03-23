-- AlterTable
ALTER TABLE "ChannelMember" ADD COLUMN     "muteEnd" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "ChatSocket" (
    "id" SERIAL NOT NULL,
    "channelMemberId" INTEGER NOT NULL,
    "socketId" INTEGER NOT NULL,

    CONSTRAINT "ChatSocket_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChatSocket_id_key" ON "ChatSocket"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ChatSocket_socketId_key" ON "ChatSocket"("socketId");

-- AddForeignKey
ALTER TABLE "ChatSocket" ADD CONSTRAINT "ChatSocket_channelMemberId_fkey" FOREIGN KEY ("channelMemberId") REFERENCES "ChannelMember"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
