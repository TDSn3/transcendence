export interface User {
  username: string,
  profilePictureUrl: string,
  rank: number,
  gamesWon: number,
  gamesLost: number,
  gameHistory: GameResult[],
}

export type UserEssential = Omit<User, 'rank' | 'gamesWon' | 'gamesLost' | 'gameHistory'>;

export interface Player {
  user: UserEssential,
  score: number,
  won: boolean,
}

export interface GameResult {
  players: [Player, Player],
}
