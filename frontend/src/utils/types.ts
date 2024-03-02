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
  createdAt: number,
  updatedAt: number,
  TwoFactorAuthSecret: string,
  isTwoFactorEnabled: boolean,

  intraId: number,
  email42: string,
  login: string,
  firstName: string,
  lastName: string,
  avatar: string,

  status: UserStatus,

  accessToken: string,
}

export const emptyUser: User = {
  id: '',
  createdAt: 0,
  updatedAt: 0,
  TwoFactorAuthSecret: '',
  isTwoFactorEnabled: false,

  intraId: 0,
  email42: '',
  login: '',
  firstName: '',
  lastName: '',
  avatar: '',

  status: UserStatus.OFFLINE,

  accessToken: '',
};

interface UserData {
  TwoFactorAuthSecret: string,
  avatar: string,
  email42: string,
  firstName: string,
  intraId: number,
  isTwoFactorEnabled: boolean,
  lastName: string,
  login: string,
}

export interface AuthResponse {
  accessToken: string,
  created: number,
  userData: UserData,
}
