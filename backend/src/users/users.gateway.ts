import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { User } from '@prisma/client';
import {
  UserForStatusWebSocket,
  enumToString,
  ServerToClientEvents,
  ClientToServerEvents,
} from './interface/usersStatus.interface';
import { UsersService } from './users.service';
import color from '../utils/color';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/users/web-socket',
})
export class UsersStatusGateway {
  constructor(private usersService: UsersService) {}

  @WebSocketServer() server: Server = new Server<
    ServerToClientEvents,
    ClientToServerEvents
  >();

  handleConnection(client: Socket) {
    printClientConnected(client);

    this.server.emit('clientOnline', { ClientId: client.id });
  }

  handleDisconnect(client: Socket) {
    printClientDisconnected(client);

    this.usersService
      .removeUserWebSocketId(client.id)
      .then((deletedUserStatusWebSocketId) => {
        this.server.emit('clientOffline', {
          UserId: deletedUserStatusWebSocketId.userId,
        });
      })
      .catch((error) => {
        console.log('Error removeUserWebSocketId: {\n', error, '\n}');
      });
  }

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() data: UserForStatusWebSocket,
    @ConnectedSocket() client: Socket,
  ): void {
    this.usersService
      .findById(data.id)
      .then((user) => {
        printReceivedMessage(data, user);

        this.usersService
          .addUserStatusWebSocketId(user.id, client.id)
          .then(() => {
            this.server.emit('message', data);
          })
          .catch((error) => {
            console.log(`Error addUserStatusWebSocketId: {\n`, error, '\n}');
          });
      })
      .catch((error) => {
        console.log(`Error findById: {\n`, error, '\n}');
      });
  }

  @SubscribeMessage('startGame')
  handleStartGame(
    @MessageBody() data: UserForStatusWebSocket,
    @ConnectedSocket() client: Socket,
  ): void {
    this.usersService
      .findById(data.id)
      .then((user) => {
        printReceivedMessage(data, user);

        this.usersService
          .addUserStatusWebSocketId(user.id, client.id)
          .then(() => {
            this.server.emit('message', data);
          })
          .catch((error) => {
            console.log(`Error addUserStatusWebSocketId: {\n`, error, '\n}');
          });
      })
      .catch((error) => {
        console.log(`Error findById: {\n`, error, '\n}');
      });
  }
}

const printClientConnected = (client: Socket) => {
  console.log(
    color.GREEN,
    'New client connected',
    color.RESET,
    color.DIM_GREEN,
    `id: ${client.id}`,
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

const printReceivedMessage = (data: UserForStatusWebSocket, user: User) => {
  console.log(
    color.BLUE,
    'Received message:',
    color.RESET,
    color.BOLD,
    enumToString(data.status),
    color.RESET,
    color.DIM,
    `from ${user.login}`,
    color.RESET,
  );
};
