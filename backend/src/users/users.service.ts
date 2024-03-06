import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      include: { friends: true },
    });
    return users;
  }

  async findById(id: string): Promise<User> {
    if (!id) {
      throw new BadRequestException('User ID is required');
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { friends: true },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByLogin(login: string): Promise<User> {
    if (!login) {
      throw new BadRequestException('login is required');
    }

    const user = await this.prisma.user.findUnique({
      where: { login },
      include: { friends: true },
    });

    if (!user) {
      throw new NotFoundException(`User with username ${login} not found`);
    }

    return user;
  }

  async findOneByLogin(login: string): Promise<{ login: string }> {
    try {
      if (!login) {
        throw new BadRequestException('login is required');
      }

      const loginValue = await this.prisma.user.findUnique({
        where: {
          login: login,
        },
        select: {
          login: true,
        },
      });

      if (!loginValue) {
        throw new NotFoundException(`User with username ${login} not found`);
      }

      return loginValue;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new NotFoundException('User not found');
    }
  }

  async addFriend(id: string, idUserToAddAsFriend: string): Promise<User> {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: {
          friends: {
            connect: { id: idUserToAddAsFriend },
          },
        },
      });

      if (user) {
        return user;
      }

      throw new Error();
    } catch (error: unknown) {
      throw new Error('Failed to add a friend');
    }
  }

  async addUserStatusWebSocketId(
    id: string,
    webSocketId: string,
  ): Promise<User> {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: { webSocketId: { push: webSocketId } },
      });

      if (user) {
        return user;
      }

      throw new Error();
    } catch (error: unknown) {
      throw new Error('Failed to add web socket id');
    }
  }

  // async removeUserWebSocketId(webSocketId: string): Promise<User> {
  //   try {
  //     const users = await this.prisma.user.findMany({
  //       where: { webSocketId: { has: webSocketId } },
  //     });

  //     const user = users[0];

  //     if (user && users.length === 1) {
  //       const filteredWebSocketId = user.webSocketId.filter(
  //         (idValue) => idValue !== webSocketId,
  //       );

  //       const updatedUser = await this.prisma.user.update({
  //         where: { id: user.id },
  //         data: { webSocketId: { set: filteredWebSocketId } },
  //       });

  //       return updatedUser;
  //     }

  //     throw new Error();
  //   } catch (error: unknown) {
  //     throw new Error('Failed to remove web socket id');
  //   }
  // }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
