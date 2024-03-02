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

enum UserStatus {
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
