/* eslint-disable */

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PrismaService } from "../../prisma/prisma.service";
import { ChannelsService } from "./channels.service";
import { Response } from "express";
import { Channel, Message } from "@prisma/client";

@Controller("api/channels")
@ApiTags("channels")
export class ChannelsController {
  constructor(private channelService: ChannelsService) {}

  @Post()
  async create(@Body() param: { intraId: number, name: string, password: string, private: boolean }, @Res() res: Response) {
    return (this.channelService.create(param.intraId, param)
      .then((param) => {
        res.status(200).json({ message: "Channel successfully created", param });
      })
      .catch(() => {
        res.status(501).json({ message: "Channel creation failed" });
      })
	);
  }

  @Post("direct")
  async createDirect(@Body() param: { intraId: number, receiverId: number }): Promise<Channel> {
	return (this.channelService.createDirect(param.intraId, param.receiverId));
  }

  @Get("names")
  async getAllNames(): Promise<{id: number, name: string}[]> {
	return (this.channelService.getAllNames());
  }

  @Get(":channelName/:intraId/check")
  async channelChecker(@Param("channelName") channelName: string, @Param("intraId") intraId: number): Promise<boolean> {
	return (this.channelService.channelChecker(channelName, intraId));
  }

  @Get(":channelName/getId")
  async getChannelId(@Param("channelName") channelName: string): Promise<number> {
	return (this.channelService.getChannelId(channelName));
  }

  @Get(":channelName/messages")
  async getAllMessages(@Param("channelName") channelName: string): Promise<Message[]> {
	return (this.channelService.getAllMessages(channelName));
  }

  @Patch(":channelName/update")
  async channelUpdate(@Param("channelName") channelName: string, @Body() param: { intraId: number, newPassword: string, newPrivate: boolean }): Promise<Channel> {
	return (this.channelService.channelUpdate(await this.getChannelId(channelName), param.newPassword, param.newPrivate, param.intraId));
  }
}
