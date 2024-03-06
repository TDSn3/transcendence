import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { AddFriendDto } from './dto/AddFriendDto';

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

  @Get('status/id/:id')
  getStatus(@Param('id') id: string): Promise<{ status: boolean }> {
    return this.usersService.getStatus(id);
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
  addFriend(
    @Param('id') id: string,
    @Body() addFriendDto: AddFriendDto,
  ): Promise<User> {
    return this.usersService.addFriend(id, addFriendDto.idUserToAddAsFriend);
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
