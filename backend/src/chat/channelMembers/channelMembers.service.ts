/* eslint-disable */

import { Injectable } from "@nestjs/common";
import { ChannelMember } from "@prisma/client";
import { PrismaService } from "nestjs-prisma";
import { ChannelsService } from "../channels/channels.service";

@Injectable()
export class ChannelMembersService {
	constructor(private channelsService: ChannelsService, private prisma: PrismaService) {}

	async create(intraId: number, channelId: number): Promise<ChannelMember> {
		if (await this.isIn(channelId, intraId)) {
			return (this.getChannelMember(channelId, intraId));
		}
		try {
			console.log("new channelMember:", intraId, channelId);
			const newChannelMember: ChannelMember = await this.prisma.channelMember.create({
				data: {
					userId: intraId,
					channelId: channelId,
				}
			});
			return (newChannelMember);
		}
		catch (error) {
			throw error;
		}
	}

	async getAllChannelMembers(channelId: number): Promise<ChannelMember[]> {
		const channelMembers: ChannelMember[] = await this.prisma.channelMember.findMany({
			where: {
				channelId: channelId,
			}
		});
		return (channelMembers);
	}

	async isIn(channelId: number, idToFind: number): Promise<boolean> {
		const members: ChannelMember[] = await this.getAllChannelMembers(channelId);

		for (const user of members) {
			if (user.userId === idToFind) {
				return (true);
			}
		}
		return (false);
	}

	async getChannelMember(channelId: number, idToFind: number): Promise<ChannelMember> {
		const member: any = await this.prisma.channelMember.findUnique({
			where: {
				userId_channelId: {
					userId: idToFind,
					channelId: channelId
				}
			}
		});

		return (member);
	}

	async channelMute(channelId: number, intraIdToMute: number, intraId: number): Promise<boolean> {
		const executor: ChannelMember = await this.prisma.channelMember.findUnique({
			where: {
				userId_channelId: {
					userId: intraId,
					channelId: channelId
				}
			}
		});
		const member: ChannelMember = await this.prisma.channelMember.findUnique({
			where: {
				userId_channelId: {
					userId: intraIdToMute,
					channelId: channelId
				}
			}
		});

		if (!executor.isAdmin || member.isAdmin){
			return (member.isMute);
		}

		const res: ChannelMember = await this.prisma.channelMember.update({
			where: {
				userId_channelId: {
					userId: intraIdToMute,
					channelId: channelId
				}
			},
			data: {
				isMute: !member.isMute
			}
		});

		return (res.isMute);
	}

	async channelBan(channelId: number, intraIdToBan: number, intraId: number): Promise<boolean> {
		const executor: ChannelMember = await this.prisma.channelMember.findUnique({
			where: {
				userId_channelId: {
					userId: intraId,
					channelId: channelId
				}
			}
		});
		const member: ChannelMember = await this.prisma.channelMember.findUnique({
			where: {
				userId_channelId: {
					userId: intraIdToBan,
					channelId: channelId
				}
			}
		});

		if (!executor.isAdmin || member.isAdmin){
			return (member.isBan);
		}

		const res: ChannelMember = await this.prisma.channelMember.update({
			where: {
				userId_channelId: {
					userId: intraIdToBan,
					channelId: channelId
				}
			},
			data: {
				isBan: !member.isBan
			}
		});

		return (res.isBan);

	}

	async channelAdmin(channelId: number, intraIdToOp: number, intraId: number): Promise<boolean> {
		const executor: ChannelMember = await this.prisma.channelMember.findUnique({
			where: {
				userId_channelId: {
					userId: intraId,
					channelId: channelId
				}
			}
		});
		const member: ChannelMember = await this.prisma.channelMember.findUnique({
			where: {
				userId_channelId: {
					userId: intraIdToOp,
					channelId: channelId
				}
			}
		});

		if (!executor.isOwner){
			return (member.isAdmin);
		}

		const res: ChannelMember = await this.prisma.channelMember.update({
			where: {
				userId_channelId: {
					userId: intraIdToOp,
					channelId: channelId
				}
			},
			data: {
				isAdmin: !member.isAdmin
			}
		});

		return (res.isAdmin);
	}
}
