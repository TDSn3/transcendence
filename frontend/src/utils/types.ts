// export interface User {
//   id: string,
//   username: string,
//   profilePictureUrl: string,
//   rank: number,
//   gamesWon: number,
//   gamesLost: number,
// }

// export type UserEssential = Omit<User, 'rank' | 'gamesWon' | 'gamesLost'>;

// export interface Player {
//   user: UserEssential,
//   score: number,
//   won: boolean,
// }

// export interface GameResult {
//   players: [Player, Player],
// }

// export interface UserGameHistory {
//   userId: string,
//   gameHistory: GameResult[],
// }

export enum UserStatus {
  ONLINE,
  OFFLINE,
  PLAYING,
}

export interface User {
  id: string,
  createdAt: string,
  updatedAt: string,
  TwoFactorAuthSecret: string,
  isTwoFactorEnabled: boolean,

  intraId: number,
  email42: string,
  login: string,
  firstName: string,
  lastName: string,
  avatar: string,
  wins: number,
  losses: number,

  status: UserStatus,

  accessToken: string,

  friends: User[],
  friendOf: User[],
}

export const emptyUser: User = {
  id: '',
  createdAt: '',
  updatedAt: '',
  TwoFactorAuthSecret: '',
  isTwoFactorEnabled: false,

  intraId: 0,
  email42: '',
  login: '',
  firstName: '',
  lastName: '',
  avatar: '',
  wins: 0,
  losses: 0,

  status: UserStatus.OFFLINE,

  accessToken: '',

  friends: [],
  friendOf: [],
};
