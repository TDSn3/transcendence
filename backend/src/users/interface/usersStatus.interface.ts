/* eslint-disable prettier/prettier */

export interface User {
  id: string,
  status: string,
}

// Interface for when server emits events to clients.
export interface ServerToClientEvents {
  chat: (e: User) => void,
}

// Interface for when clients emit events to the server.
export interface ClientToServerEvents {
  chat: (e: User) => void,
}
