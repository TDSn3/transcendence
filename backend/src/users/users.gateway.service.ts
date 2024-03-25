import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { User, UserStatus } from '@prisma/client';
import { UsersService } from './users.service';
import {
  UserForStatusWebSocket,
  ServerToClientEvents,
} from './interface/usersStatus.interface';
import color from '../utils/color';

@Injectable()
export class UsersStatusGatewayService {
  constructor(private usersService: UsersService) {}

  private server: Server<ServerToClientEvents>;

  init(server: Server<ServerToClientEvents>) { this.server = server }

  async disconnect(client: Socket): Promise<void> {
    printClientDisconnected(client);

    this.usersService
      .removeUserWebSocketId(client.id)
      .then((deletedUserStatusWebSocketId) => {

        this.usersService
          .changeStatus(deletedUserStatusWebSocketId.userId, UserStatus.OFFLINE)
          .then(() => {
            
            this.server.emit('message', {
              id: deletedUserStatusWebSocketId.userId,
              status: UserStatus.OFFLINE,
          })})
          .catch((error) => console.log(`Error changeStatus: {\n`, error, '\n}'));
      })
      .catch((error) => console.log('Error removeUserWebSocketId: {\n', error, '\n}'));
  }

  async message(data: UserForStatusWebSocket, client: Socket): Promise<void> {
    this.usersService
      .findById(data.id)
      .then((user) => {
        printReceivedMessage(user, data.status);

        this.usersService
          .addUserStatusWebSocketId(user.id, client.id)
          .then(() => {

            this.usersService
              .changeStatus(user.id, data.status)
              .then(() => this.server.emit('message', data))
              .catch((error) => console.log(`Error changeStatus: {\n`, error, '\n}'));
          })
          .catch((error) => console.log(`Error addUserStatusWebSocketId: {\n`, error, '\n}'));
      })
      .catch((error) => console.log(`Error findById: {\n`, error, '\n}'));
  }

  async updateStatus(data: UserForStatusWebSocket): Promise<void> {
    this.usersService
      .findById(data.id)
      .then((user) => {
        printReceivedMessage(user, data.status);

        this.usersService
          .changeStatus(user.id, data.status)
          .then(() => this.server.emit('updateStatus', data))
          .catch((error) => console.log(`Error changeStatus: {\n`, error, '\n}'));
      })
      .catch((error) => console.log(`Error findById: {\n`, error, '\n}'));
  }
}

const printReceivedMessage = (user: User, content: string | UserStatus) => {
  console.log(
    color.BLUE,
    'Received message:',
    color.RESET,
    color.BOLD,
    content,
    color.RESET,
    color.DIM,
    `from ${user.login}`,
    color.RESET,
  );
};

const printClientDisconnected = (client: Socket) => {
  console.log(
    color.RED,
    'Client disconnected',
    color.RESET,
    color.DIM_RED,
    `id: ${client.id}`,
    color.RESET,
  );
};
