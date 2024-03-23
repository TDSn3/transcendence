import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { /*User,*/ UserStatus } from '@prisma/client';
import {
  UserForStatusWebSocket,
  ServerToClientEvents,
  ClientToServerEvents,
} from './interface/usersStatus.interface';
import { UsersService } from './users.service';
import { UsersStatusGatewayService } from './users.gateway.service';
import color from '../utils/color';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/users/web-socket',
})
export class UsersStatusGateway {
  constructor(
    private usersService: UsersService,
    private usersStatusGatewayService: UsersStatusGatewayService,
  ) {}

  @WebSocketServer() server: Server = new Server<
    ServerToClientEvents,
    ClientToServerEvents
  >();

  handleConnection(client: Socket) {
    printClientConnected(client);
  }

  handleDisconnect(client: Socket) {
    printClientDisconnected(client);

    this.usersService
      .removeUserWebSocketId(client.id)
      .then((deletedUserStatusWebSocketId) => {
        this.server.emit('message', {
          id: deletedUserStatusWebSocketId.userId,
          status: UserStatus.OFFLINE,
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
    this.usersStatusGatewayService.message(this.server, data, client);

    // this.usersService
    //   .findById(data.id)
    //   .then((user) => {
    //     printReceivedMessage(user, data.status);

    //     this.usersService
    //       .addUserStatusWebSocketId(user.id, client.id)
    //       .then(() => {
    //         this.server.emit('message', data);
    //       })
    //       .catch((error) => {
    //         console.log(`Error addUserStatusWebSocketId: {\n`, error, '\n}');
    //       });
    //   })
    //   .catch((error) => {
    //     console.log(`Error findById: {\n`, error, '\n}');
    //   });
  }

  @SubscribeMessage('updateStatus')
  handleUpdateStatus(@MessageBody() data: UserForStatusWebSocket): void {
    this.usersStatusGatewayService.updateStatus(this.server, data);

    // this.usersService
    //   .findById(data.id)
    //   .then((user) => {
    //     printReceivedMessage(user, data.status);

    //     this.usersService
    //       .changeStatus(user.id, data.status)
    //       .then(() => {
    //         this.server.emit('updateStatus', data);
    //       })
    //       .catch((error) => {
    //         console.log(`Error changeStatus: {\n`, error, '\n}');
    //       });
    //   })
    //   .catch((error) => {
    //     console.log(`Error findById: {\n`, error, '\n}');
    //   });
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

// const printReceivedMessage = (user: User, content: string | UserStatus) => {
//   console.log(
//     color.BLUE,
//     'Received message:',
//     color.RESET,
//     color.BOLD,
//     content,
//     color.RESET,
//     color.DIM,
//     `from ${user.login}`,
//     color.RESET,
//   );
// };
