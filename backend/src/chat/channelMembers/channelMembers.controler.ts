import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ChannelMembersService } from "./channelMembers.service";
import { Response } from "express";

@Controller("api/channelMembers")
@ApiTags("channelMembers")
export class ChannelMembersController {
	constructor(private readonly channelMembersService: ChannelMembersService) {}

	@Post()
	async create(@Body() param: { intraId: number, channelId: number }, @Res() res: Response) {
		return (this.channelMembersService.create(param.intraId, param.channelId, res))
			.then((param) => {
				res.status(200).json({ message: "ChannelMember successfully created", param });
			})
			.catch(() => {
				res.status(501).json({ message: "ChannelMember creation failed" });
			});
	}
}