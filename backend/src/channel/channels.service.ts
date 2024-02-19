import { Injectable } from '@nestjs/common';
import { Channel } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ChannelsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(chan: { name: string, description: string }, res): Promise<Channel> {
    try {
      console.log("whats happening");
      const newChannel = await this.prisma.channel.create({
        data: {
          name: chan.name,
          description: chan.description,
        },
      });
      return newChannel;
    } catch (error) {
      res.status(501).json({ message: 'Channel creation failed', error: error.message });
      throw error; // Re-throw the error to propagate it to the controller
    }
  }
}
