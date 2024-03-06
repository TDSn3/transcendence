/* eslint-disable prettier/prettier */

export enum UserStatus {
  ONLINE,
  OFFLINE,
  PLAYING,
}

export const enumToString = (enumToConvert: UserStatus) => {
  if (enumToConvert === UserStatus.ONLINE) {
    return ('ONLINE');
  } else if (enumToConvert === UserStatus.OFFLINE) {
    return ('OFFLINE');
  } else {
    return ('PLAYING');
  }
}

export interface UserWebSocket {
  id: string,
  status: UserStatus,
}

export interface ServerToClientEvents {
  message: (data: UserWebSocket) => void,
  clientOnline: (data: { id: string }) => void,
  clientOffline: (data: { id: string }) => void,
}

export interface ClientToServerEvents {
  message: (data: UserWebSocket) => void,
}
