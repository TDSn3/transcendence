import { Injectable, NotFoundException, UnprocessableEntityException } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";

@Injectable()
export class GamesService {
	constructor(private prisma: PrismaService) {}

	async isInGame(login: string): Promise<boolean> {
		try {
			const res = await this.prisma.user.findUnique({
				where: { login: login },
				select: { status: true }
			});

			if (res) return (res.status === 'PLAYING');
      throw new NotFoundException('Failed to find user by id'); // HTTP 404 Not Found
		} catch (error: unknown) {
      if (error instanceof NotFoundException) throw new NotFoundException(error.message); // HTTP 404 Not Found
      throw new UnprocessableEntityException('Failed to find user by id'); // HTTP 422 Unprocessable Entity  
    }
	}
}
