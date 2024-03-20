import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PrismaService } from "../../prisma/prisma.service";
import { ChannelsService } from "./channels.service";
import { Response } from "express";
import { Channel } from "@prisma/client";

@Controller("api/channels")
@ApiTags("channels")
export class ChannelsController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly channelService: ChannelsService,
  ) {}

  @Post()
  async create(@Body() param: { intraId: number, name: string, password: string, private: boolean }, @Res() res: Response) {
    return (this.channelService.create(param.intraId, param, res))
      .then((param) => {
        res.status(200).json({ message: "Channel successfully created", param });
      })
      .catch(() => {
        res.status(501).json({ message: "Channel creation failed" });
      }
	);
  }

  @Get("names")
  async getAllNames(): Promise<{id: number, name: string}[]> {
	return (this.channelService.getAllNames());
  }

  @Get(":channelName/check")
  async channelNameChecker(@Param("channelName") channelName: string): Promise<boolean> {
	return (this.channelService.channelNameChecker(channelName));
  }

  @Get(":channelName/getId")
  async getChannelId(@Param("channelName") channelName: string): Promise<number> {
	return (this.channelService.getChannelId(channelName));
  }

  @Get(":channelName/messages")
  async getAllMessages(@Param("channelName") channelName: string): Promise<any> {
	return (this.channelService.getAllMessages(channelName));
  }

  @Patch(":channelName")
  async channelUpdate(@Param("channelName") channelName: string, @Body() param: { newPassword: string, newPrivate: boolean }): Promise<Channel> {
	return (this.channelService.channelUpdate(channelName, param.newPassword, param.newPrivate));
  }
}
