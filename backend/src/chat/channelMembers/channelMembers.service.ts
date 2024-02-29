import { Injectable } from "@nestjs/common";
import { ChannelMember } from "@prisma/client";
import { PrismaService } from "nestjs-prisma";

@Injectable()
export class ChannelMembersService {
	constructor(private readonly prisma: PrismaService) {}
}
