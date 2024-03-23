import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ChannelMembersService } from "./channelMembers.service";
import { Response } from "express";
import { ChannelsService } from "../channels/channels.service";

@Controller("api/channelMembers")
@ApiTags("channelMembers")
export class ChannelMembersController {
	constructor(private channelMembersService: ChannelMembersService, private channelsService: ChannelsService) {}

	@Post()
	async create(@Body() param: { intraId: number, channelId: number }, @Res() res: Response) {
		return (this.channelMembersService.create(param.intraId, param.channelId))
			.then((param) => {
				res.status(200).json({ message: "ChannelMember successfully created", param });
			})
			.catch(() => {
				res.status(501).json({ message: "ChannelMember creation failed" });
			}
		);
	}

	@Get(":channelName/:intraId")
	async getChannelMember(@Param("channelName") channelName: string, @Param("intraId") intraId: number): Promise<any> {
		return (this.channelMembersService.getChannelMember(await this.channelsService.getChannelId(channelName), intraId));
	}

	@Patch(":channelName/:intraId/mute")
	async channelMute(@Param("channelName") channelName: string, @Param("intraId") intraIdToMute: number, @Body() param: { intraId: number }): Promise<boolean> {
	  return (this.channelMembersService.channelMute(await this.channelsService.getChannelId(channelName), intraIdToMute, param.intraId));
	}

	@Patch(":channelName/:intraId/ban")
	async channelBan(@Param("channelName") channelName: string, @Param("intraId") intraIdToBan: number, @Body() param: { intraId: number }): Promise<boolean> {
	  return (this.channelMembersService.channelBan(await this.channelsService.getChannelId(channelName), intraIdToBan, param.intraId));
	}

	@Patch(":channelName/:intraId/op")
	async channelAdmin(@Param("channelName") channelName: string, @Param("intraId") intraIdToOp: number, @Body() param: { intraId: number }): Promise<boolean> {
	  return (this.channelMembersService.channelAdmin(await this.channelsService.getChannelId(channelName), intraIdToOp, param.intraId));
	}
}
