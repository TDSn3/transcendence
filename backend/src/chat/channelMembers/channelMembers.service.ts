/* eslint-disable */

import { Injectable } from "@nestjs/common";
import { ChannelMember } from "@prisma/client";
import { PrismaService } from "nestjs-prisma";

@Injectable()
export class ChannelMembersService {
	constructor(private prisma: PrismaService) {}

	async create(intraId: number, channelId: number): Promise<ChannelMember> {
		if (await this.isIn(channelId, intraId)) {
			return (await this.getChannelMember(channelId, intraId));
		}
		try {
			console.log("creating", intraId, channelId);
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

	async isIn(channelId: number, idToFind: number): Promise<boolean> {
		const res : ChannelMember = await this.prisma.channelMember.findUnique({
			where: {
				userId_channelId: {
					userId: idToFind,
					channelId: channelId
				}
			}
		});
		return (res === null ? false : true)
	}

	async getChannelMember(channelId: number, idToFind: number): Promise<ChannelMember> {
		const res : ChannelMember = await this.prisma.channelMember.findUnique({
			where: {
				userId_channelId: {
					userId: idToFind,
					channelId: channelId
				}
			}
		});

		return (res);
	}

	async channelMessage(channelId: number, intraId: number): Promise<boolean> {
		const member: ChannelMember = await this.prisma.channelMember.findUnique({
			where: {
				userId_channelId: {
					userId: intraId,
					channelId: channelId
				}
			}
		});
		if (member.isMute) {
			const res: ChannelMember = await this.prisma.channelMember.update({
				where: {
					userId_channelId: {
						userId: intraId,
						channelId: channelId
					}
				},
				data: {
					isMute: (Date.now() < member.muteEnd.getTime())
				}
			});
			return (res.isMute);
		}
		return (member.isMute);
	}

	async channelMute(channelId: number, intraIdToMute: number, intraId: number) {
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

		if (executor.isAdmin || !member.isAdmin){
			const res = await this.prisma.channelMember.update({
				where: {
					userId_channelId: {
						userId: intraIdToMute,
						channelId: channelId
					}
				},
				data: {
					isMute: true,
					muteEnd: new Date(Date.now() + (10 * 1000))
				}
			});
		}
	}

	async channelKick(channelId: number, intraIdToKick: number, intraId: number): Promise<boolean> {
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
					userId: intraIdToKick,
					channelId: channelId
				}
			}
		});

		return (executor.isAdmin && !member.isAdmin);
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

		if (!executor.isAdmin || member.isAdmin) {
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
