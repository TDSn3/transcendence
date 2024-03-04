import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
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
  findById(@Param('id') id: string): Promise<User> {
    return this.usersService.findById(id);
  }

  @Get('login/:login')
  findByLogin(@Param('login') login: string): Promise<User> {
    return this.usersService.findByLogin(login);
  }

  @Get('login/me/:login')
  findOneByLogin(@Param('login') login: string): Promise<{ login: string }> {
    return this.usersService.findOneByLogin(login);
  }

  @Post('id/ad-friend/:id')
  adFriend(
    @Param('id') id: string,
    @Body() idUserToAddAsFriend: string,
  ): Promise<User> {
    return this.usersService.adFriend(id, idUserToAddAsFriend);
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
