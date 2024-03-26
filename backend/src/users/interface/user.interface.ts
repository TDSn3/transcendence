import { User, UserStatusWebSocketId, GameHistory } from '@prisma/client';

export interface GameHistoryExtend extends GameHistory {
  WinningUser: User,
  LosingUser: User,
}
  
export interface UserExtend extends User {
  statusWebSocketId: UserStatusWebSocketId[],
  friends: User[],
  friendOf: User[],
  blocked: User[],
  historyGamesWon: GameHistoryExtend[],
  historyGamesLost: GameHistoryExtend[],
}
  