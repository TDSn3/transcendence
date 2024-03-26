/* eslint-disable */

import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ChannelsService } from "./channels.service";
import { Response } from "express";
import { Channel, Message } from "@prisma/client";
import { AddChannelDto } from './dto/Dto';
import { AuthGuardToken } from 'src/auth/guard/jwt.guard';

@Controller("api/channels")
@ApiTags("channels")
export class ChannelsController {
  constructor(private channelService: ChannelsService) {}

  @UseGuards(AuthGuardToken)
  @Post()
  create(@Body() addChannelDto: AddChannelDto): Promise<Channel> {
    return (this.channelService.create(addChannelDto));
  }

  @UseGuards(AuthGuardToken)
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

  @UseGuards(AuthGuardToken)
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

  @UseGuards(AuthGuardToken)
  @Get("names")
  async getAllNames(@Query("intraId") intraId: number): Promise<Channel[]> {
    return this.channelService.getAllNames(intraId);
  }

  @UseGuards(AuthGuardToken)
  @Get(":channelName/:intraId/check")
  async channelChecker(@Param("channelName") channelName: string, @Param("intraId") intraId: number): Promise<Channel | null> {
	  return (this.channelService.channelChecker(channelName, intraId));
  }

  @UseGuards(AuthGuardToken)
  @Get(":channelName/getId")
  async getChannelId(@Param("channelName") channelName: string): Promise<number> {
	return (this.channelService.getChannelId(channelName));
  }

  @UseGuards(AuthGuardToken)
  @Get(":channelName/messages")
  async getAllMessages(@Param("channelName") channelName: string): Promise<Message[]> {
	return (this.channelService.getAllMessages(channelName));
  }

  @UseGuards(AuthGuardToken)
  @Get(":channelName/isDual")
  async getIsDual(@Param("channelName") channelName: string): Promise<boolean> {
	console.log("isDual", await this.channelService.getIsDual(channelName));
	return (this.channelService.getIsDual(channelName));
  }

  @UseGuards(AuthGuardToken)
  @Patch(":channelName/update")
  async channelUpdate(@Param("channelName") channelName: string, @Body() param: { intraId: number, newPassword: string, newPrivate: boolean }): Promise<Channel> {
	return (this.channelService.channelUpdate(await this.getChannelId(channelName), param.newPassword, param.newPrivate, param.intraId));
  }

}
