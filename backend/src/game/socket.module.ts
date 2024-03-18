import { Module } from "@nestjs/common";
import { GameGateway } from "./GameGateway";

@Module({
providers: [/*SocketEvents*/ GameGateway]
})
export class SocketModule{}