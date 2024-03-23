import { Injectable } from "@nestjs/common";
import { Message } from "@prisma/client";
import { PrismaService } from "nestjs-prisma";

@Injectable()
export class MessagesService {
	constructor(private prisma: PrismaService) {}

	async create(intraId: number, channelId: number, content: string): Promise<Message> {
		try {
			const newMessage = await this.prisma.message.create({
				include: {
					member: {
						select: {
							intraId: true,
							login: true,
							avatar: true
						}
					},
					channel: {
						select: {
							name: true
						}
					}
				},
				data: {
					userId: intraId,
					channelId: channelId,
					content: content,
				}
			})
			return (newMessage);
		} catch (error) {
			throw error;
		}
	}
}