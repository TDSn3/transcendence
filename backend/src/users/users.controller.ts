import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { User } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('api/users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get('id/:id')
  findAllById(@Param('id') id: string) : Promise<User> {
    return this.usersService.findAllById(+id);
  }

  @Get('login/:login')
  findAllByLogin(@Param('login') login: string) : Promise<User> {
    return this.usersService.findAllByLogin(login);
  }

  @Get('login/me/:login')
  async findOneByLogin(@Param('login') login: string): Promise<User> {
    return this.usersService.findOneByLogin(login);
  }

  // @Patch('login/:login')
  // update(@Param('login') login: string): Promise<User> {
  //   return this.usersService.updateData(login);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
