import { Module } from "@nestjs/common";
import { WebSocketGateway } from "@nestjs/websockets"

@WebSocketGateway({
	namespace: "/chat",
	cors: {
		origin: "*",
	},
})