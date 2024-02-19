import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';
import { ChannelsService } from './channels.service';
import { Request, Response } from "express";


@Controller('api/channels')
@ApiTags('channels')
export class ChannelsController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly channelService: ChannelsService,
  ) {}

  @Post('create')
  async create(@Body() chan: { name: string, description: string }, @Res() res: Response) {
    return this.channelService.create(chan, res)
    .then((chan) => {
      res.status(200).json({
        message: 'Channel successfully created',
        chan});
      }
    )
    .catch(() => {
      res.status(501).json({  message: 'Channel creation failed' });
    });
  }
}
