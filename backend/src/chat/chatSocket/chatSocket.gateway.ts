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
	}

	@SubscribeMessage("chatSend")
	async handleChatSend(client: Socket, payload: { user: User, channelName: string, message: string }) {
		const channelId = await this.channelsService.getChannelId(payload.channelName);
		if (!(await this.channelMembersService.channelMessage(channelId, payload.user.intraId))) {
			this.server.to(payload.channelName).emit("chatReceive", { newMessage: await this.messagesService.create(payload.user.intraId, channelId, payload.message) });
		}
	}

	@SubscribeMessage("chatKick")
	async handleChatKick(client: Socket, payload: { channelName: string, intraIdToKick: number, intraId: number }) {
		if (this.channelMembersService.channelKick(await this.channelsService.getChannelId(payload.channelName), payload.intraIdToKick, payload.intraId)) {
			this.server.to(payload.channelName).emit("chatKick", { intraIdToKick: payload.intraIdToKick })
		}
	}
}
