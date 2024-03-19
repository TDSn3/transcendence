import { Injectable } from "@nestjs/common";
import { ChannelMember } from "@prisma/client";
import { PrismaService } from "nestjs-prisma";

@Injectable()
export class ChannelMembersService {
	constructor(private prisma: PrismaService) {}

	async create(intraId: number, channelId: number): Promise<ChannelMember> {
		if (await this.isIn(channelId, intraId)) {
			return (this.getChannelMember(channelId, intraId));
		}
		try {
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
		const members: ChannelMember[] = await this.getAllChannelMembers(channelId);

		for (const user of members) {
			if (user.userId === idToFind) {
				return (user);
			}
		}
	}
}
