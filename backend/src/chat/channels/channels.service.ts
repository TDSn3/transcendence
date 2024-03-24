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
	async createDirectChannel(userOneIntraId: number, userTwoIntraId: number): Promise<Channel> {
		try {
			// Créer une nouvelle room de chat directe
			const channelExist = await this.prisma.channel.findFirst({
				where: {
					AND: [
						{ members: { some: { userId: userOneIntraId } } },
						{ members: { some: { userId: userTwoIntraId } } },
						{ isDual: true }
					]
				}
			});
			console.log("channelExist:", channelExist);
			if (channelExist) {
				return channelExist;
			}
			const newDirectChannel = await this.prisma.channel.create({
				data: {
					name: `direct-${userOneIntraId}-${userTwoIntraId}`,
					private: true,
					isDual: true, // Indique qu'il s'agit d'un chat direct
					members: {
						create: [
							{ userId: userOneIntraId, isOwner: true, isAdmin: true},
							{ userId: userTwoIntraId }
						]
					}
				}
			});
			return newDirectChannel;
		} catch (error) {
			throw error;
		}
	}

	async getAllNames(intraId: number): Promise<Channel[]> {
		try {
			const publicChannels = await this.prisma.channel.findMany({
				where: { private: false },
				include: { members: true },
			});
		
			const privateChannelsWithMember = await this.prisma.channel.findMany({
				where: {
					private: true,
					members: { some: { userId: intraId } },
				},
				include: { members: true },
			});
			
			return [...publicChannels, ...privateChannelsWithMember];
		} catch (error: unknown) {
			throw new Error('Failed to find all channels');
		}
	}
	
	async channelChecker(channelName: string, intraId: number): Promise<boolean> {
		if (intraId === 0) {
			return (null);
		}

		const channel = await this.prisma.channel.findUnique({
			where: {
				name: channelName
			}
		});

		if (!channel) {
			return (null);
		}
		console.log("intraId", intraId)
		console.log("channel.id", channel.id)
		const member: ChannelMember = await this.prisma.channelMember.findUnique({
			where: {
				userId_channelId: {
					userId: intraId,
					channelId: channel.id
				}
			}
		});

		console.log(member);
		if (member.isBan) {
			return (null);
		}
		return (channel);
	}

	async getChannelId(channelName: string): Promise<number> {
		console.log("channelName:", channelName);
		const res = await this.prisma.channel.findUnique({
			where: {
				name: channelName
			},
			select: {
				id: true
			}
		});
		console.log("channelId:", res.id);
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

	async channelUpdate(channelId: number, newPassword: string, newPrivate: boolean, intraId: number): Promise<Channel> {
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

	async addMember(user: string, channelName: string): Promise<ChannelMember> {
		const channelId = await this.getChannelId(channelName);
		console.log(channelId);
		const userId = await this.prisma.user.findUnique({
			where: {
				login: user
			}
		});
		const isExistChannelMember = await this.prisma.channelMember.findUnique({
			where: {
				userId_channelId: {
					userId: userId.intraId,
					channelId: channelId
				}
			}
		});
		if (!isExistChannelMember){
			const newChannelMember: ChannelMember = await this.prisma.channelMember.create({
				data: {
					userId: userId.intraId,
					channelId: channelId
				}
			});
			console.log("newChannelMember:", newChannelMember);
			return (newChannelMember);
		}
		console.log("isExistChannelMember:", isExistChannelMember);
		return (isExistChannelMember);
	}
}