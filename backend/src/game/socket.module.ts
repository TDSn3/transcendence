import { Module } from "@nestjs/common";
import { SocketEvents } from "./socketEvents";
import { GameGateway } from "./GameGateway";

@Module({
providers: [/*SocketEvents*/ GameGateway]
})
export class SocketModule{}