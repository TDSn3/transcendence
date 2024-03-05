import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  ServerToClientEvents,
  ClientToServerEvents,
} from './interface/usersStatus.interface';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class UsersStatusGateway {
  @WebSocketServer() server: Server = new Server<
    ServerToClientEvents,
    ClientToServerEvents
  >();

  handleConnection(client: Socket) {
    console.log(`New client connected with the id: ${client.id}`);
    this.server.emit('ClientOnline', { id: client.id });
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected with the id: ${client.id}`);
    this.server.emit('ClientOffline', { id: client.id });
  }

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): void {
    console.log(`Received message: ${data} from ${client.id}`);

    this.server.emit('message', data);
  }
}
