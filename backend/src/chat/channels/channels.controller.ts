import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PrismaService } from "../../prisma/prisma.service";
import { ChannelsService } from "./channels.service";
import { Request, Response } from "express";
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
    return this.channelService.create(param.intraId, param, res)
      .then((chan) => {
        res.status(200).json({ message: "Channel successfully created", chan });
    })
    .catch(() => {
    	res.status(501).json({ message: "Channel creation failed" });
    });
  }

  @Get("names")
  async getAllNames(): Promise<{id: number, name: string}[]> {
	return (this.channelService.getAllNames());
  }
}
