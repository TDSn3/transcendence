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
		const members: ChannelMember[] = await this.getAllChannelMembers(channelId);

		for (const user of members) {
			if (user.userId === idToFind) {
				return (user);
			}
		}
	}

	async channelMute(channelName: string, intraId: number): Promise<any> {
		// const member = this.getChannelMember(await this.channelsService.getChannelId(channelName), intraId);
		const member: any = await this.prisma.channelMember.findUnique({
			where: {
				userId_channelId: {
					userId: intraId,
					channelId: await this.channelsService.getChannelId(channelName)
				}
			}
		});
		console.log(member);

		// const res = await this.prisma.channelMember.update({});
		return (member);
	}
}
