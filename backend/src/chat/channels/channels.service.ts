/* eslint-disable */

import { Injectable } from '@nestjs/common';
import { Channel, ChannelMember, Message, User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { AddChannelDto } from './dto/Dto';
import bcrypt from 'bcrypt';

@Injectable()
export class ChannelsService {
	constructor(private prisma: PrismaService) {}

	async create(addChannelDto: AddChannelDto): Promise<Channel> {
		try {
			const users = await this.prisma.user.findMany();
			const membersToCreate = users.map(({ intraId }) => ({
				userId: intraId,
				isAdmin: intraId === addChannelDto.intraId,
				isOwner: intraId === addChannelDto.intraId,
			  }));
			const data: any = {
				name: addChannelDto.name,
				private: addChannelDto.private,
				members: {
					create: membersToCreate
				}				
			}

			if (addChannelDto.password && addChannelDto.password !== '') {
				const saltRounds = 10
				const passwordHash = await bcrypt.hash(addChannelDto.password, saltRounds);

				data.password = passwordHash;
			}

			const newChannel = await this.prisma.channel.create({
				data: data
			});

			if (newChannel) return newChannel;

			throw new Error();
		} catch (error: unknown) {
			throw new Error('Failed to add a channel');
		}
	}

	async createDirectChannel(userOneIntraId: number, userTwoIntraId: number): Promise<Channel> {
		try {
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
					isDual: true,
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
				where: { private: false,
					members: { some: { userId: intraId } }},
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
	

	async channelChecker(channelName: string, intraId: number): Promise<Channel | null> {
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

		const member: ChannelMember = await this.prisma.channelMember.findUnique({
			where: {
				userId_channelId: {
					userId: intraId,
					channelId: channel.id
				}
			}
		});

		if (member.isBan) {
			return (null);
		}

		return (channel);
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

	async findByName(name: string): Promise<Channel> {	
		try {
			const channel = await this.prisma.channel.findUnique({
				where: { name },
			});

			if (channel) return channel;

			throw new Error();
		} catch (error: unknown) {
			throw new Error('Failed to find channel by name');
		}
	}

	async findById(id: number): Promise<Channel> {	
		try {
			const channel = await this.prisma.channel.findUnique({
				where: { id },
			});

			if (channel) return channel;

			throw new Error();
		} catch (error: unknown) {
			throw new Error('Failed to find channel by name');
		}
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
	
	async getChannelMembersWithoutMessages(channelId: number): Promise<User[]> {
		const channelMembers = await this.prisma.channelMember.findMany({
		  where: { channelId },
		  include: { user: true }
		});
	  
		const usersWithMessages = await this.prisma.message.findMany({
		  where: { channelId },
		  select: { userId: true }
		});
	  

		const userIdsWithMessages = new Set(usersWithMessages.map(u => u.userId));

		const filteredMembers = channelMembers.filter(member =>
		  !userIdsWithMessages.has(member.userId) && !member.isAdmin && !member.isOwner
		).map(member => member.user); // Retourner les objets utilisateur correspondants
	  
		return filteredMembers;
	  }

	async getUsersToAdd(channelId: number): Promise<User[]> {
		const allUsers = await this.prisma.user.findMany();

		const currentMembers = await this.prisma.channelMember.findMany({
			where: { channelId: channelId },
		});
		const currentMemberIds = new Set(currentMembers.map(member => member.userId));
		
		const usersToAdd = allUsers.filter(user => !currentMemberIds.has(user.intraId));
		return usersToAdd;
	}
	  
	async channelUpdate(channelId: number, newPassword: string, newPrivate: boolean, intraId: number): Promise<Channel> {
		if (newPrivate){
			const users = await this.getChannelMembersWithoutMessages(channelId);
			console.log("users:", users);
			// enlever tous les users qui n'ont pas encore de messages
			users.forEach(async (user) => {
				await this.prisma.channelMember.delete({
					where: {
						userId_channelId: {
							userId: user.intraId,
							channelId: channelId
						}
					}
				});
			});
		}
		else {
			const usersToAdd = await this.getUsersToAdd(channelId);
			console.log("usersToAdd:", usersToAdd);
			for (const user of usersToAdd) {
			  await this.prisma.channelMember.create({
				data: {
				  channelId: channelId,
				  userId: user.intraId,
				}
			  });
			}
		  }
			
		const channel = await this.prisma.channel.update({
			where: {
				id: channelId
			},
			data: {
				password: await bcrypt.hash(newPassword, 10),
				private: newPrivate
			}
		});
		return channel;
	}
	
	async getIsDual(channelName: string): Promise<boolean> {
		const res = await this.prisma.channel.findUnique({
			where: {
				name: channelName
			}
		})
		return (res.isDual);
	}

	async leaveChannel(channelName: string, intraId: number): Promise<void> {
		const channelId = await this.getChannelId(channelName);
		await this.prisma.channelMember.delete({
			where: {
				userId_channelId: {
					userId: intraId,
					channelId: channelId
				}
			}
		});
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