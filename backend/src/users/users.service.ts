import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, UserStatus, UserStatusWebSocketId, GameHistory } from '@prisma/client';
import { UserExtend } from './interface/user.interface';
import { NotFoundException } from '@nestjs/common';
import color from '../utils/color';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    try {
      const users = await this.prisma.user.findMany({
        include: {
          friends: true,
          friendOf: true,
          historyGamesWon: { include: { WinningUser: true, LosingUser: true } },
          historyGamesLost: { include: { WinningUser: true, LosingUser: true } },
        },
      });
   
      if (users) return users;
      throw new NotFoundException('Failed to find all users'); // HTTP 404 Not Found
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw new NotFoundException(error.message); // HTTP 404 Not Found
      throw new UnprocessableEntityException('Failed to find all users'); // HTTP 422 Unprocessable Entity  
    }
  }

  async findById(id: string): Promise<UserExtend> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        include: {
          statusWebSocketId: true,
          friends: true,
          friendOf: true,
  		    blocked: true,
          historyGamesWon: { include: { WinningUser: true, LosingUser: true } },
          historyGamesLost: { include: { WinningUser: true, LosingUser: true } },
        },
      });

      if (user) return user;
      throw new NotFoundException('Failed to find user by id'); // HTTP 404 Not Found
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw new NotFoundException(error.message); // HTTP 404 Not Found
      throw new UnprocessableEntityException('Failed to find user by id'); // HTTP 422 Unprocessable Entity   
    }
  }

  async findByIntraId(id: number): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { intraId: id },
      });

      if (user) return user;
      throw new NotFoundException('Failed to find user by intraId'); // HTTP 404 Not Found
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw new NotFoundException(error.message); // HTTP 404 Not Found
      throw new UnprocessableEntityException('Failed to find user by intraId'); // HTTP 422 Unprocessable Entity   
    }
  }

  async findByLogin(login: string): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { login },
        include: {
          friends: true,
          friendOf: true,
          historyGamesWon: { include: { WinningUser: true, LosingUser: true } },
          historyGamesLost: { include: { WinningUser: true, LosingUser: true } },
        },
      });

      if (user) return user;
      throw new NotFoundException('Failed to find user by login'); // HTTP 404 Not Found
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw new NotFoundException(error.message); // HTTP 404 Not Found
      throw new UnprocessableEntityException('Failed to find user by login'); // HTTP 422 Unprocessable Entity   
    }
  }

  async findOneByLogin(login: string): Promise<{ login: string }> {
    try {
      const loginValue = await this.prisma.user.findUnique({
        where: { login: login },
        select: { login: true },
      });

      if (loginValue) return loginValue;
      throw new NotFoundException('Failed to find user login'); // HTTP 404 Not Found
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw new NotFoundException(error.message); // HTTP 404 Not Found
      throw new UnprocessableEntityException('Failed to find user login'); // HTTP 422 Unprocessable Entity   
    }
  }

  async getBlockedUsers(id: string): Promise<any> {
    try {
      const res = await this.prisma.user.findUnique({
        where: { id: id },
        select: { blocked: true },
      });

      if (res) return res.blocked;
      throw new NotFoundException('Failed to find user by id'); // HTTP 404 Not Found
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw new NotFoundException(error.message); // HTTP 404 Not Found
      throw new UnprocessableEntityException('Failed to find user by id'); // HTTP 422 Unprocessable Entity
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

      if (user) return user;

      throw new Error();
    } catch (error) {
      throw new UnprocessableEntityException('Failed to add a friend'); // HTTP 422 Unprocessable Entity
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
    } catch (error) {
      throw new UnprocessableEntityException('Failed to delete a friend'); // HTTP 422 Unprocessable Entity
    }
  }

  async addBlock(id: string, idUserToAddBlock: string): Promise<User> {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: {
          blocked: {
            connect: { id: idUserToAddBlock },
          },
        },
      });

      if (user) return user;
      throw new Error();
    } catch (error) {
      throw new UnprocessableEntityException('Failed to add a block'); // HTTP 422 Unprocessable Entity
    }
  }

  async deleteBlock(id: string, idUserToDelBlock: string): Promise<User> {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: {
          blocked: {
            disconnect: { id: idUserToDelBlock },
          },
        },
      });

      if (user) return user;
      throw new Error();
    } catch (error) {
      throw new UnprocessableEntityException('Failed to delete a block'); // HTTP 422 Unprocessable Entity
    }
  }

// Socket ─────────────────────────────────────────────────────────────────────────────────────────

  async addUserStatusWebSocketId(id: string, webSocketId: string): Promise<User> {
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

        if (userUpdated) return userUpdated;
        throw new Error();
      }
      throw new NotFoundException('Failed to find user by id'); // HTTP 404 Not Found
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw new NotFoundException(error.message); // HTTP 404 Not Found
      throw new UnprocessableEntityException('Failed to update user status'); // HTTP 422 Unprocessable Entity
    }
  }

  async removeUserWebSocketId(webSocketId: string): Promise<UserStatusWebSocketId> {
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

          if (deletedUserStatusWebSocketId) return deletedUserStatusWebSocketId;
          throw new Error();
        }
        throw new NotFoundException('Failed to find user by id'); // HTTP 404 Not Found
      }
      throw new NotFoundException('Failed to find userStatusWebSocketId by id'); // HTTP 404 Not Found
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw new NotFoundException(error.message); // HTTP 404 Not Found
      throw new UnprocessableEntityException('Failed to remove userStatusWebSocketId'); // HTTP 422 Unprocessable Entity
    }
  }

// ────────────────────────────────────────────────────────────────────────────────────────────────

  async changeStatus(id: string, newStatus: UserStatus): Promise<User> {
    try {
      const user = await this.findById(id);
      
      if (user) {
        if (newStatus === UserStatus.LOGOUT) {
          printLogout(user);
          newStatus = UserStatus.OFFLINE;
        } else if (newStatus === UserStatus.OFFLINE && user.status === UserStatus.OFFLINE) {
          console.log('Double OFFLINE');
          newStatus = UserStatus.OFFLINE;
        } else {
          if (newStatus === UserStatus.OFFLINE && user.statusWebSocketId.length > 0) {
            printNoOffline(user);
            return user;
          }
          if (newStatus !== UserStatus.END_PLAYING && user.status === UserStatus.PLAYING) {
            printAlreadyPlaying(newStatus, user);
            return user;
          }
          if (newStatus === UserStatus.END_PLAYING) {
            printEndPlaying(user);
            newStatus = UserStatus.ONLINE;
          }
        }

        const userUpdated = await this.prisma.user.update({
          where: { id },
          data: { status: newStatus },
        });

        if (userUpdated) return userUpdated;
        throw new Error();
      }
      throw new NotFoundException('Failed to find user by id'); // HTTP 404 Not Found
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw new NotFoundException(error.message); // HTTP 404 Not Found
      throw new UnprocessableEntityException('Failed to update user status'); // HTTP 422 Unprocessable Entity
    }
  }

  async getStatus(id: string): Promise<{ status: UserStatus }> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        include: { statusWebSocketId: true },
      });

      if (user) return { status: user.status };
      throw new Error();
    } catch (error) {
      throw new NotFoundException('Failed to find user by id'); // HTTP 404 Not Found
    }
  }

  async getRank(id: string): Promise<{ rank: number }> {
    try {
      const users = await this.prisma.user.findMany({
        include: {
          historyGamesWon: { include: { WinningUser: true, LosingUser: true } },
          historyGamesLost: { include: { WinningUser: true, LosingUser: true } },
        },
      });

      if (users && users.length > 0) {
        const usersSortByRank = users.sort(
          (a, b) => {
            const rankA = a?.historyGamesWon?.reduce((accumulator, currentValue: GameHistory) => {
              if (currentValue.WinningUserScore === currentValue.LosingUserScore) return (accumulator);
              return (accumulator + 1);
            }, 0)
            -
            a?.historyGamesLost?.reduce((accumulator, currentValue: GameHistory) => {
              if (currentValue.WinningUserScore === currentValue.LosingUserScore) return (accumulator);
              return (accumulator + 1);
            }, 0);

            const rankB = b?.historyGamesWon?.reduce((accumulator, currentValue: GameHistory) => {
              if (currentValue.WinningUserScore === currentValue.LosingUserScore) return (accumulator);
              return (accumulator + 1);
            }, 0)
            -
            b?.historyGamesLost?.reduce((accumulator, currentValue: GameHistory) => {
              if (currentValue.WinningUserScore === currentValue.LosingUserScore) return (accumulator);
              return (accumulator + 1);
            }, 0);

            // const rankA = a.historyGamesWon?.length ?? 0 - a.historyGamesLost?.length ?? 0;
            // const rankB = b.historyGamesWon?.length ?? 0 - b.historyGamesLost?.length ?? 0;

            return rankB - rankA;
          },
        );

        const selectUserRank = usersSortByRank.findIndex((user) => user.id === id);

        return ({ rank: selectUserRank + 1 });
      }
      throw new NotFoundException('Failed to find all users'); // HTTP 404 Not Found
    } catch (error: unknown){
      if (error instanceof NotFoundException) throw new NotFoundException(error.message); // HTTP 404 Not Found
      throw new UnprocessableEntityException('Failed to calculate rank'); // HTTP 422 Unprocessable Entity
    }
  }

  async updateAvatar(id: string, url: string): Promise<User> {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: { avatar: url },
      });

      if (user) return user;
    } catch (error) {
      throw new UnprocessableEntityException('Failed to update user avatar'); // HTTP 422 Unprocessable Entity
    }
  }

  async updateLogin(id: string, newLogin: string): Promise<User> {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: { login: newLogin },
      });

      if (user) return user;
      throw new Error();
    } catch (error) {
      throw new UnprocessableEntityException('Failed to update user login'); // HTTP 422 Unprocessable Entity
    }
  }

  async addSecretTwoFA(id: string, secret: string): Promise<User> {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: { twoFactorAuthSecret: secret },
      });

      if (user) return user;
      throw new Error();
    } catch (error) {
      throw new UnprocessableEntityException('Failed to update user twoFactorAuthSecret'); // HTTP 422 Unprocessable Entity
    }
  }

  async handleTwoFactorAuth(id: string): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
   
      if (user) {
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
      }
      throw new NotFoundException(`User with ID ${id} not found`); // HTTP 404 Not Found 
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw new NotFoundException(error.message); // HTTP 404 Not Found
      throw new UnprocessableEntityException('Failed to update user isTwoFactorAuthEnabled'); // HTTP 422 Unprocessable Entity
    }
  }

  async addTwoFactorAuthSecret(id: string, secret: string): Promise<User> {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: { twoFactorAuthSecret: secret },
      });

      if (user) return user;
      throw new Error();
    } catch (error) {
      throw new UnprocessableEntityException('Failed to update two factor authentication secret'); // HTTP 422 Unprocessable Entity
    }
  }
}

const printLogout = (user: User) => {
  console.log(
    color.MAGENTA,
    'LOGOUT',
    color.RESET,
    color.DIM,
    `from ${user.login}`,
    color.RESET,
  );
};

const printAlreadyPlaying = (newStatus: UserStatus, user: User) => {
  console.log(
    color.MAGENTA,
    newStatus,
    'but already PLAYING',
    color.RESET,
    color.DIM,
    `from ${user.login}`,
    color.RESET,
  );
};

const printEndPlaying = (user: User) => {
  console.log(
    color.MAGENTA,
    'END_PLAYING  >  ONLINE',
    color.RESET,
    color.DIM,
    `from ${user.login}`,
    color.RESET,
  );
};

const printNoOffline = (user: User) => {
  console.log(
    color.MAGENTA,
    'OFFLINE but is not LOGOUT and other same user ONLINE',
    `\n├─  OFFLINE  >  ${user.status}`,
    color.RESET,
    color.DIM,
    `from ${user.login}`,
    color.RESET,
  );
};
