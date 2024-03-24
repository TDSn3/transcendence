/* eslint-disable */

import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards, Req, Res } from "@nestjs/common";
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

  @Post("addMember")
  async addMember(@Body() param: { user: string, channelName: string }, @Res() res: Response) {
    console.log(param);
    return (this.channelService.addMember(param.user, param.channelName)
      .then((param) => {
        res.status(200).json({ message: "Member successfully added", param });
      })
      .catch((err) => {
        console.log(err);
        res.status(501).json({ message: "Member addition failed" });
      })
    );
  }
  @Post("createDirectChannel")
  async createDirectChannel(@Body() param: { user1: number, user2: number }, @Res() res: Response) {
    return (this.channelService.createDirectChannel(param.user1, param.user2)
      .then((param) => {
        res.status(200).json({ message: "Direct Channel successfully created", param });
      })
      .catch(() => {
        res.status(501).json({ message: "Direct Channel creation failed" });
      })
    );
  }
//   @Post("direct")
//   async createDirect(@Body() param: { intraId: number, receiverId: number }): Promise<Channel> {
// 	return (this.channelService.createDirect(param.intraId, param.receiverId));
//   }

  @Get("names")
  async getAllNames(@Query("intraId") intraId: number): Promise<Channel[]> {
    return this.channelService.getAllNames(intraId);
  }

  @Get(":channelName/:intraId/check")
  async channelChecker(@Param("channelName") channelName: string, @Param("intraId") intraId: number): Promise<Channel | null> {
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
	console.log("update");
	return (this.channelService.channelUpdate(await this.getChannelId(channelName), param.newPassword, param.newPrivate, param.intraId));
  }

}
