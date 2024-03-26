import { Injectable, NotFoundException, UnprocessableEntityException } from "@nestjs/common";
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
			if (newMessage) return (newMessage);
			throw new NotFoundException('Failed to find all users');
		} catch (error: unknown) {
			if (error instanceof NotFoundException) throw new NotFoundException(error.message);
			throw new UnprocessableEntityException('Failed to create message');
		}
	}
}