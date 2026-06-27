import * as cookie from 'cookie';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from 'src/message/message.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private userSockets = new Map<number, Set<string>>();

  constructor(
    private jwtService: JwtService,
    private messageService: MessageService,
  ) {}

  afterInit(server: any) {
    console.log('CHATGATEWAY INIT: ', server);
    server.use((socket: Socket, next) => {
      try {
        const rawCookies = socket.handshake.headers.cookie;
        if (!rawCookies) {
          return next(new Error('No cookies provided'));
        }

        const parsedCookies = cookie.parseCookie(rawCookies);
        const token = parsedCookies['access_token'];

        if (!token) {
          return next(new Error('No access token'));
        }

        const payload = this.jwtService.verify(token, {
          secret: process.env.JWT_ACCESS_SECRET,
        });

        socket.data.user = payload;
        next();
      } catch (err: any) {
        next(new Error('Unauthorized'));
      }
    });
  }

  handleConnection(client: Socket) {
    console.log('CONNECTED, user:', client.data.user);
    const userId = client.data.user.sub;
    if (!userId) {
      client.disconnect();
      return;
    }

    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, new Set());
    }

    this.userSockets.get(userId)!.add(client.id);
    this.server.emit('userOnline', { userId });
  }

  handleDisconnect(client: Socket) {
    console.log('DISCONNECTED, user:', client.data.user);
    const userId = client.data.user.sub;
    if (!userId) return;

    const sockets = this.userSockets.get(userId);
    sockets?.delete(client.id);

    if (!sockets || sockets.size === 0) {
      this.userSockets.delete(userId);
      this.server.emit('userOffline', { userId });
    }
  }

  @SubscribeMessage('getOnlineStatus')
  handleGetOnlineStatus(@MessageBody() userId: number) {
    return this.userSockets.has(userId);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    client.join(data.conversationId);
    console.log(`Client ${client.id} joined room ${data.conversationId}`);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @MessageBody() data: { conversationId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(data.conversationId);
    console.log(`Client ${client.id} left room ${data.conversationId}`);
  }

  @SubscribeMessage('sendMessage')
  async sendMessage(
    @ConnectedSocket() client: Socket,
    @CurrentUser() user: { sub: number },
    @MessageBody()
    data: {
      conversationId: string;
      message: string;
    },
  ) {
    const createdMessage = await this.messageService.create(
      user.sub,
      data.conversationId,
      data.message,
    );

    client.to(data.conversationId).emit('receiveMessage', createdMessage);
    return createdMessage;
  }
}
