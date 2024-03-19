import { Injectable } from '@nestjs/common';
import { Channel, Message } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ChannelsService {
	constructor(private prisma: PrismaService) {}

	async create(intraId: number, param: { name: string, password: string, private: boolean }, res: any): Promise<Channel> {
		try {
			if (!/^[a-zA-Z]+$/.test(param.name)) {
				throw 1;
			}
			const newChannel = await this.prisma.channel.create({
				data: {
					name: param.name,
					password: param.password,
					private: param.private,
					members: {
						create: [
							{ userId: intraId, isAdmin: true, isOwner: true }
						]
					}
				}
			});
			return (newChannel);
		} catch (error) {
			throw error;
		}
	}

	async getAllNames(): Promise<{id: number, name: string}[]> {
		const channelsNames = await this.prisma.channel.findMany({
			select: {
				id: true,
				name: true,
			}
		});
		return (channelsNames);
	}

	async channelNameChecker(channelName: string): Promise<boolean> {
		const res = await this.prisma.channel.findUnique({
			where: {
				name: channelName
			}
		});
		return (res !== null ? true : false);
	}

	async getChannelId(channelName: string): Promise<number> {
		const res = await this.prisma.channel.findUnique({
			where: {
				name: channelName
			},
			select: {
				id: true
			}
		});
		return (res.id);
	}

	async getAllMessages(channelName: string): Promise<Message[]> {
		const channelId = await this.getChannelId(channelName);
		const res = await this.prisma.message.findMany({
			include: {
				member: {
					select: {
						intraId: true,
						login: true,
						avatar: true,
					}
				}
			},
			where: {
				channelId: channelId
			}
		})
		return (res);
	}

	// async passwordUpdate(channelName: string, newPassword: string): Promise<Channel> {
	// 	const res = await this.prisma.channel.update({
	// 		where: {
	// 		}
	// 	});
	// }
}