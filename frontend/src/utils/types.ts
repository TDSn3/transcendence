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
  wins: number,
  losses: number,

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
  wins: 0,
  losses: 0,

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
  wins: number,
  losses: number,
}

export interface AuthResponse {
  accessToken: string,
  created: number,
  userData: UserData,
}

// TODO: armoniser le back et front avec la db
export const transformAuthResponseToUser = (authResponse: AuthResponse): User => ({
  id: '',
  createdAt: authResponse.created,
  updatedAt: -1, // TODO
  TwoFactorAuthSecret: authResponse.userData.TwoFactorAuthSecret,
  isTwoFactorEnabled: authResponse.userData.isTwoFactorEnabled,

  intraId: authResponse.userData.intraId,
  email42: authResponse.userData.email42,
  login: authResponse.userData.login,
  firstName: authResponse.userData.firstName,
  lastName: authResponse.userData.lastName,
  avatar: authResponse.userData.avatar,
  wins: 0,
  losses: 0,

  status: UserStatus.ONLINE, // TODO

  accessToken: authResponse.accessToken,
});
