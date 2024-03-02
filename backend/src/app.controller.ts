import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

// import { User, UserGameHistory } from './utils/types';
// import users from './data/users';
// import usersGameHistories from './data/usersGameHistories';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('api/ping')
  getPing(): string {
    // console.log('someone pinged here');
    return 'pong';
  }

  // @Get('api/users-game-histories')
  // getUsersGameHistories(): UserGameHistory[] {
  //   return usersGameHistories;
  // }

  // @Get('api/users-game-histories/:id')
  // getUserGameHistory(@Param('id') id: string): UserGameHistory {
  //   return usersGameHistories.find(
  //     (value) => value.userId === id,
  //   ) as UserGameHistory; // TODO: remove "as UserGameHistory" by a verification function
  // }
}
