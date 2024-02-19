import { Injectable } from '@nestjs/common';
import { Channel } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ChannelsService {
	constructor(private readonly prisma: PrismaService) {}

	async create(chan: {name: string, description: string}): Promise<Channel> {
		const newChannel = await this.prisma.user.create({
			data: {
				name: chan.name,
				description: chan.description,
			}
		})
		return (newChannel);
	}
}
