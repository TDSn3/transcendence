// Game history

export interface AddGameHistory {
  winningUserId: string,
  winningUserScore: number,
  losingUserId: string,
  losingUserScore: number,
}

export interface InterfaceGameHistory {
  id: string,
  playedAt: Date,
  WinningUser: User,
  WinningUserId: string,
  WinningUserScore: number,
  LosingUser: User,
  LosingUserId: string,
  LosingUserScore: number,
}

// Other

export enum UserStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  PLAYING = 'PLAYING',
}

export interface User {
  id: string,
  createdAt: string,
  updatedAt: string,
  TwoFactorAuthSecret: string,
  isTwoFactorAuthEnabled: boolean,

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
  blocked: User[],
  blockedOf: User[],

  historyGamesWon: InterfaceGameHistory[],
  historyGamesLost: InterfaceGameHistory[],
}

export const emptyUser: User = {
  id: '',
  createdAt: '',
  updatedAt: '',
  TwoFactorAuthSecret: '',
  isTwoFactorAuthEnabled: false,

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
  blocked: [],
  blockedOf: [],

  historyGamesWon: [],
  historyGamesLost: [],
};

// Web socket

export type UserForStatusWebSocket = Pick<User, 'id' | 'status'>;

export interface ServerToClientEvents {
  message: (data: UserForStatusWebSocket) => void,
}

export interface ClientToServerEvents {
  message: (data: UserForStatusWebSocket) => void,
}
