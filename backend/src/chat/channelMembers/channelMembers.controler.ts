import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ChannelMembersService } from "./channelMembers.service";

@Controller("api/channelMembers")
@ApiTags("channelMembers")
export class ChannelMembersController {
	constructor(private readonly channelMembersService: ChannelMembersService) {}

	@Post()
	async create(@Body() member: {} ) {

	}
}
