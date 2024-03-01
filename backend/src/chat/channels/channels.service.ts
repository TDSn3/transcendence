import { Injectable } from '@nestjs/common';
import { Channel } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ChannelsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(intraId: number, chan: { name: string, password: string, private: boolean }, res: any): Promise<Channel> {
    try {
	  console.log("intraId: ", intraId);
      const newChannel = await this.prisma.channel.create({
        data: {
          name: chan.name,
		  password: chan.password,
		  private: chan.private,
		  members: {
		    create: [
			  { userId: intraId, isAdmin: true, isOwner: true }
			]
		  }
        },
      });
      return (newChannel);
    }
	catch (error) {
      res.status(501).json({ message: 'Channel creation failed', error: error.message });
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
}
