import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { User, UserStatus } from '@prisma/client';
import {
  AddBlockDto,
  AddFriendDto,
  DeleteBlockDto,
  DeleteFriendDto,
  UpdateAvatarDto,
  UpdateLoginDto,
} from './dto/Dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuardToken } from 'src/auth/guard/jwt.guard';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }
  @UseGuards(AuthGuardToken)
  @Get('id/:id')
  findById(@Param('id') id: string): Promise<User> {
    return this.usersService.findById(id);
  }

  @UseGuards(AuthGuardToken)
  @Get('status/id/:id')
  getStatus(@Param('id') id: string): Promise<{ status: UserStatus }> {
    return this.usersService.getStatus(id);
  }

  @UseGuards(AuthGuardToken)
  @Get('rank/id/:id')
  getRank(@Param('id') id: string): Promise<{ rank: number }> {
    return this.usersService.getRank(id);
  }

  @UseGuards(AuthGuardToken)
  @Get('login/:login')
  findByLogin(@Param('login') login: string): Promise<User> {
    return this.usersService.findByLogin(login);
  }

  @UseGuards(AuthGuardToken)
  @Get('login/me/:login')
  findOneByLogin(@Param('login') login: string): Promise<{ login: string }> {
    return this.usersService.findOneByLogin(login);
  }
  @UseGuards(AuthGuardToken)
  @Get(':id/blocked')
  getBlockedUsers(@Param('id') id: string): Promise<any> {
    return this.usersService.getBlockedUsers(id);
  }
  @UseGuards(AuthGuardToken)
  @Post('id/ad-friend/:id')
  addFriend(
    @Param('id') id: string,
    @Body() addFriendDto: AddFriendDto,
  ): Promise<User> {
    return this.usersService.addFriend(id, addFriendDto.idUserToAddAsFriend);
  }
  @UseGuards(AuthGuardToken)
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

  @Post('id/ad-block/:id')
  addBlock(
    @Param('id') id: string,
    @Body() addBlockDto: AddBlockDto,
  ): Promise<User> {
    return this.usersService.addBlock(id, addBlockDto.idUserToAddBlock);
  }
  @UseGuards(AuthGuardToken)
  @Post('id/del-block/:id')
  delBlock(
    @Param('id') id: string,
    @Body() deleteBlockDto: DeleteBlockDto,
  ): Promise<User> {
    return this.usersService.deleteBlock(id, deleteBlockDto.idUserToDelBlock);
  }
  @UseGuards(AuthGuardToken)
  @Post('id/avatar/:id')
  updateAvatar(
    @Param('id') id: string,
    @Body() updateAvatarDto: UpdateAvatarDto,
  ): Promise<User> {
    return this.usersService.updateAvatar(id, updateAvatarDto.url);
  }

  @UseGuards(AuthGuardToken)
  @Post('id/login/:id')
  updateLogin(
    @Param('id') id: string,
    @Body() updateLoginDto: UpdateLoginDto,
  ): Promise<User> {
    return this.usersService.updateLogin(id, updateLoginDto.newLogin);
  }
}
