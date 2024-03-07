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
		socket.emit("coucou");
		console.log("+", socket.id);
	}

	handleDisconnect(socket: Socket) {
		console.log("-", socket.id);
	}
}


// CHATGPT:
// import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';

// @WebSocketGateway({
//   cors: {
//     origin: '*',
//   },
// })
// export class ChatSocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
//   @WebSocketServer()
//   server: Server;

//   channels: { [channel: string]: number } = {}; // Keep track of active users in each channel

//   // When a client connects
//   handleConnection(socket: Socket) {
//     socket.on('join', (channel: string) => {
//       socket.join(channel); // Join the specified channel
//       if (!this.channels[channel]) {
//         this.channels[channel] = 0;
//       }
//       this.channels[channel]++;
//       this.server.to(channel).emit('users', this.channels[channel]); // Send the current user count to all clients in the channel
//     });
//   }

//   // When a client disconnects
//   handleDisconnect(socket: Socket) {
//     socket.on('leave', (channel: string) => {
//       if (this.channels[channel]) {
//         this.channels[channel]--;
//         this.server.to(channel).emit('users', this.channels[channel]); // Send the current user count to all clients in the channel
//       }
//       socket.leave(channel); // Leave the specified channel
//     });
//   }

//   // Example message handler
//   @SubscribeMessage('message')
//   handleMessage(client: Socket, payload: any): void {
//     const channel = Object.keys(client.rooms).find(room => room !== client.id); // Find the channel the client is in
//     if (channel) {
//       client.to(channel).emit('message', payload); // Broadcast the message to all clients in the channel except the sender
//     }
//   }
// }
