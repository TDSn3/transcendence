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

// Web socket

export type UserWebSocket = Pick<User, 'id' | 'status'>;

export interface ServerToClientEvents {
  message: (data: UserWebSocket) => void,
  clientOnline: (data: { id: string }) => void,
  clientOffline: (data: { id: string }) => void,
}

export interface ClientToServerEvents {
  message: (data: UserWebSocket) => void,
}
