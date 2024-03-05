import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
	namespace: "/chat",
	cors: {
		origin: "*",
	},
})
export class ChatSocketGateway {
	@WebSocketServer()
	server: Server;

	handleConnection(socket: Socket) {
		socket.on('connect', () => {
			this.server.emit("ret", "coucou");
		});
	}
}
