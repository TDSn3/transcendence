import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "nestjs-prisma";

@Injectable()
export class GamesService {
	constructor(private prisma: PrismaService) {}


	async isInGame(login: string): Promise<boolean> {
		const res = await this.prisma.user.findUnique({
			where: {
				login: login,
			},
			select: {
				status: true,
			}
		});
		return (res?.status === 'PLAYING');
	}
}