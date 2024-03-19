export interface User {
  id: string,
  username: string,
  profilePictureUrl: string,
  rank: number,
  gamesWon: number,
  gamesLost: number,
  isTwoFactorAuthEnabled: boolean,
  twoFactorAuthSecret?: string,
}

export type UserEssential = Omit<User, 'rank' | 'gamesWon' | 'gamesLost'>;

export interface Player {
  user: UserEssential,
  score: number,
  won: boolean,
}

export interface GameResult {
  players: [Player, Player],
}

export interface UserGameHistory {
  userId: string,
  gameHistory: GameResult[],
}
