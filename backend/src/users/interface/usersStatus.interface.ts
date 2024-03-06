/* eslint-disable prettier/prettier */

import { User } from '@prisma/client';

export type UserForStatusWebSocket = Pick<User, 'id' | 'status'>;

export interface ServerToClientEvents {
  message: (data: UserForStatusWebSocket) => void,
  clientOnline: (data: { ClientId: string }) => void,
  clientOffline: (data: { UserId: string }) => void,
}

export interface ClientToServerEvents {
  message: (data: UserForStatusWebSocket) => void,
}
