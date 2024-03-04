import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  // {
  //   id: '75bd25cc-6532-4cc3-9bce-e9e7e9c9ed2c',
  //   createdAt: 2024-03-04T09:12:29.721Z,
  //   updatedAt: 2024-03-04T16:32:12.575Z,
  //   twoFactorAuthSecret: null,
  //   isTwoFactorAuthEnabled: false,
  //   intraId: 1,
  //   email42: 'dummy@mail.com',
  //   login: 'dummy',
  //   firstName: 'John',
  //   lastName: 'Doe',
  //   avatar: '',
  //   status: 'ONLINE'
  // }
  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    console.log(users);
    return users;
  }

  async findAllById(id: number): Promise<User> {
    if (!id) {
      throw new BadRequestException('User ID is required');
    }

    const user = await this.prisma.user.findUnique({
      where: { email42 },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findAllByLogin(login: string): Promise<User> {
    if (!login) {
      throw new BadRequestException('login is required');
    }

    const user = await this.prisma.user.findUnique({ where: { login } });

    if (!user) {
      throw new NotFoundException(`User with username ${login} not found`);
    }
    console.log(user);
    return user;
  }

  async findOneByLogin(login: string): Promise<User | null> {
    try {
      if (!login) {
        throw new BadRequestException('login is required');
      }

      const user = await this.prisma.user.findUnique({
        where: {
          login: login,
        },
        select: {
          login: true,
        },
      });

      if (!user) {
        throw new NotFoundException(`User with username ${login} not found`);
      }

      console.log(user);
      return user;
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

  // async update(login: string): Promise<User> {
  //   return this.prisma.user.update({
  //     where: { login },
  //     data,
  //   });
  // }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
