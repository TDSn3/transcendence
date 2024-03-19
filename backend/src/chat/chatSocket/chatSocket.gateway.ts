import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { ChannelsService } from "../channels/channels.service";
import { ChannelMembersService } from "../channelMembers/channelMembers.service";
import { MessagesService } from "../messages/messages.service";
import { User } from "@prisma/client";

@WebSocketGateway({
	namespace: "/chat",
	cors: {
		origin: "*",
	},
})
export class ChatSocketGateway {
	@WebSocketServer()
	server: Server;

	constructor(private channelsService: ChannelsService, private channelMembersService: ChannelMembersService, private messagesService: MessagesService) {}

	handleConnection(socket: Socket) {
		console.log("+", socket.id);
	}

	handleDisconnect(socket: Socket) {
		console.log("-", socket.id);
	}

	@SubscribeMessage("chatJoin")
	async handleChatJoin(client: Socket, payload: { intraId: number, channelName: string }) {
		const channelId = await this.channelsService.getChannelId(payload.channelName);
		client.join(payload.channelName);
		this.channelMembersService.create(payload.intraId, channelId);
	}

	@SubscribeMessage("chatSend")
	async handleChatSend(client: Socket, payload: { user: User, channelName: string, message: string }) {
		const channelId = await this.channelsService.getChannelId(payload.channelName);
		this.server.to(payload.channelName).emit("chatReceive", { newMessage: await this.messagesService.create(payload.user.intraId, channelId, payload.message) });
	}
}
