/* eslint-disable */

import { Injectable } from '@nestjs/common';
import { Channel, ChannelMember, Message } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ChannelsService {
	constructor(private prisma: PrismaService) {}

	async create(intraId: number, param: { name: string, password: string, private: boolean }): Promise<Channel> {
		try {
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

	async channelChecker(channelName: string, intraId: number): Promise<boolean> {
		const channel = await this.prisma.channel.findUnique({
			where: {
				name: channelName
			}
		});

		if (!channel) {
			return (false);
		}

		const member: ChannelMember = await this.prisma.channelMember.findUnique({
			where: {
				userId_channelId: {
					userId: intraId,
					channelId: channel.id
				}
			}
		});

		if (member.isBan || (channel.private)) {
			return (false);
		}
		return (false);
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
						avatar: true
					}
				},
				channel: {
					select: {
						name: true
					}
				}
			},
			where: {
				channelId: channelId
			}
		});
		return (res);
	}

	async channelUpdate(channelId: number, newPassword: string, newPrivate: boolean, intraId): Promise<Channel> {
		const executor: ChannelMember = await this.prisma.channelMember.findUnique({
			where: {
				userId_channelId: {
					userId: intraId,
					channelId: channelId
				}
			}
		});
		const res = await this.prisma.channel.update({
			where: {
				id: channelId
			},
			data: {
				password: newPassword,
				private: newPrivate
			}
		});
		return (res);
	}
}