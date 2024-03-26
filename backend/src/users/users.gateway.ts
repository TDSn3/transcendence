import {
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  UserForStatusWebSocket,
  ServerToClientEvents,
  ClientToServerEvents,
} from './interface/usersStatus.interface';
import { UsersStatusGatewayService } from './users.gateway.service';
import color from '../utils/color';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/users/web-socket',
})
export class UsersStatusGateway implements OnGatewayInit {
  constructor(private usersStatusGatewayService: UsersStatusGatewayService) {}

  @WebSocketServer() server: Server = new Server<
    ServerToClientEvents,
    ClientToServerEvents
  >();

  afterInit() {
    this.usersStatusGatewayService.init(this.server);
  }

  handleConnection(client: Socket) {
    printClientConnected(client);
  }

  handleDisconnect(client: Socket) {
    this.usersStatusGatewayService.disconnect(client);
  }

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() data: UserForStatusWebSocket,
    @ConnectedSocket() client: Socket,
  ) {
    this.usersStatusGatewayService.message(data, client);
  }

  @SubscribeMessage('updateStatus')
  handleUpdateStatus(
    @MessageBody() data: UserForStatusWebSocket
  ) {
    this.usersStatusGatewayService.updateStatus(data);
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
