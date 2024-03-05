/* eslint-disable prettier/prettier */

export enum UserStatus {
  ONLINE,
  OFFLINE,
  PLAYING,
}

export interface User {
  id: string,
  status: UserStatus,
}

// Interface for when server emits events to clients.
export interface ServerToClientEvents {
  chat: (e: User) => void,
}

// Interface for when clients emit events to the server.
export interface ClientToServerEvents {
  chat: (e: User) => void,
}
