import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { User, UserStatus } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import {
  AddFriendDto,
  DeleteFriendDto,
  UpdateAvatarDto,
} from './dto/AddFriendDto';

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
  getStatus(@Param('id') id: string): Promise<{ status: UserStatus }> {
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

  @Post('id/del-friend/:id')
  deleteFriend(
    @Param('id') id: string,
    @Body() deleteFriendDto: DeleteFriendDto,
  ): Promise<User> {
    return this.usersService.deleteFriend(
      id,
      deleteFriendDto.idUserToDelAsFriend,
    );
  }

  @Post('id/avatar/:id')
  updateAvatar(
    @Param('id') id: string,
    @Body() updateAvatarDto: UpdateAvatarDto,
  ): Promise<User> {
    return this.usersService.updateAvatar(id, updateAvatarDto.url);
  }
}
