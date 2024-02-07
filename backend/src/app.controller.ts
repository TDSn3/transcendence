import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

import { User, UserGameHistory } from './utils/types';
import users from './data/users';
import usersGameHistories from './data/usersGameHistories';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('api/ping')
  getPing(): string {
    console.log('someone pinged here');
    return 'pong';
  }

  @Get('api/users')
  getUsers(): User[] {
    return users;
  }

  @Get('api/users/:id')
  getUser(@Param('id') id: string): User {
    return users.find((patientValue) => patientValue.id === id) as User; // TODO: remove "as User" by a verification function
  }

  @Get('api/users-game-histories')
  getUsersGameHistories(): UserGameHistory[] {
    return usersGameHistories;
  }
}
