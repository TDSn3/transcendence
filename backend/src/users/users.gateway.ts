import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  UserWebSocket,
  enumToString,
  ServerToClientEvents,
  ClientToServerEvents,
} from './interface/usersStatus.interface';
import { UsersService } from './users.service';

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
    console.log(`New client connected with the id: ${client.id}`);

    this.server.emit('clientOnline', { id: client.id });
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected with the id: ${client.id}`);

    this.server.emit('clientOffline', { id: client.id });
  }

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() data: UserWebSocket,
    @ConnectedSocket() client: Socket,
  ): void {
    this.usersService
      .findById(data.id)
      .then((user) => {
        console.log(
          `Received message: ${enumToString(data.status)} from ${user.login}`,
        );

        this.usersService.addUserWebSocketId(user.id, client.id);
      })
      .catch((error) => {
        console.log(`Error: `, error);
      });

    this.server.emit('message', data);
  }
}
