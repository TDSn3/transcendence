import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, UserStatus, UserStatusWebSocketId } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import color from '../utils/color';

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

  async deleteFriend(id: string, idUserToDelAsFriend: string): Promise<User> {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: {
          friends: {
            disconnect: [{ id: idUserToDelAsFriend }],
          },
        },
      });

      if (user) {
        return user;
      }

      throw new Error();
    } catch (error: unknown) {
      throw new Error('Failed to delete a friend');
    }
  }

  async addUserStatusWebSocketId(
    id: string,
    webSocketId: string,
  ): Promise<User> {
    try {
      const user = await this.findById(id);

      if (user) {
        const userUpdated = await this.prisma.user.update({
          where: { id: user.id },
          data: {
            statusWebSocketId: {
              create: [{ webSocketId: webSocketId }],
            },
          },
        });

        if (userUpdated) {
          return userUpdated;
        }
      }

      throw new Error();
    } catch (error: unknown) {
      throw new Error('Failed to add web socket id');
    }
  }

  async removeUserWebSocketId(
    webSocketId: string,
  ): Promise<UserStatusWebSocketId> {
    try {
      const userStatusWebSocketId =
        await this.prisma.userStatusWebSocketId.findUnique({
          where: { webSocketId: webSocketId },
        });

      if (userStatusWebSocketId) {
        const user = await this.findById(userStatusWebSocketId.userId);

        if (user) {
          const deletedUserStatusWebSocketId =
            await this.prisma.userStatusWebSocketId.delete({
              where: { id: userStatusWebSocketId.id },
            });

          if (deletedUserStatusWebSocketId) {
            printRemoveUserStatusWebSocketId(deletedUserStatusWebSocketId);

            return deletedUserStatusWebSocketId;
          }
        }

        throw new Error();
      }

      throw new Error();
    } catch (error: unknown) {
      throw new Error('Failed to remove web socket id');
    }
  }

  async getStatus(id: string): Promise<{ status: UserStatus }> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { statusWebSocketId: true },
    });

    if (user && user.statusWebSocketId.length > 0) {
      return { status: UserStatus.ONLINE };
    }
    return { status: UserStatus.OFFLINE };
  }

  async changeStatus(id: string, newStatus: UserStatus): Promise<User> {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: { status: newStatus },
      });

      return user;
    } catch (error: unknown) {
      throw new Error('Failed to update user status');
    }
  }

  async updateAvatar(id: string, url: string): Promise<User> {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: { avatar: url },
      });

      return user;
    } catch (error: unknown) {
      throw new Error('Failed to update url avatar');
    }
  }

  async updateLogin(id: string, newLogin: string): Promise<User> {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: { login: newLogin },
      });

      return user;
    } catch (error: unknown) {
      throw new Error('Failed to update login');
    }
  }

  async addSecretTwoFA(id: string, secret: string): Promise<User> {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: { twoFactorAuthSecret: secret },
      });

      return user;
    } catch (error: unknown) {
      throw new Error('Failed to add secret for two factor authentication');
    }
  }

  async handleTwoFactorAuth(id: string): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });
      if (!user) throw new NotFoundException(`User with ID ${id} not found`);
      if (user.isTwoFactorAuthEnabled) {
        return await this.prisma.user.update({
          where: { id },
          data: { isTwoFactorAuthEnabled: false, twoFactorAuthSecret: ' ' },
        });
      } else {
        return await this.prisma.user.update({
          where: { id },
          data: { isTwoFactorAuthEnabled: true },
        });
      }
    } catch (error: unknown) {
      throw new Error('Failed to activate two factor authentication');
    }
  }

  async addTwoFactorAuthSecret(id: string, secret: string): Promise<User> {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: { twoFactorAuthSecret: secret },
      });

      return user;
    } catch (error: unknown) {
      throw new Error('Failed to update two factor authentication secret');
    }
  }
}

const printRemoveUserStatusWebSocketId = (
  deletedUserStatusWebSocketId: UserStatusWebSocketId,
) => {
  console.log(
    color.BOLD_RED,
    'Remove UserStatusWebSocketId: ',
    color.RESET,
    color.DIM_RED,
    '{\n webSocketId: ',
    deletedUserStatusWebSocketId.webSocketId,
    '\n }',
    color.RESET,
  );
};
