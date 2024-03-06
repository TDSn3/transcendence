/* eslint-disable prettier/prettier */

import { User, UserStatus } from '@prisma/client';

export const enumToString = (enumToConvert: UserStatus) => {
  if (enumToConvert === UserStatus.ONLINE) {
    return ('ONLINE');
  } else if (enumToConvert === UserStatus.OFFLINE) {
    return ('OFFLINE');
  } else {
    return ('PLAYING');
  }
}

export type UserForStatusWebSocket = Pick<User, 'id' | 'status'>;

export interface ServerToClientEvents {
  message: (data: UserForStatusWebSocket) => void,
  clientOnline: (data: { ClientId: string }) => void,
  clientOffline: (data: { UserId: string }) => void,
}

export interface ClientToServerEvents {
  message: (data: UserForStatusWebSocket) => void,
}
