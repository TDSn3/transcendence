import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';
import { ChannelsService } from "./channels.service";

@Controller("api/channels")
@ApiTags("channels")
export class ChannelsController {
	constructor(
		private readonly prisma: PrismaService,
		private readonly channelService: ChannelsService) {}

	@Post()
	async create(@Body() chan: {name: string, description: string}) {
		return (this.channelService.create(chan));
	}
}
