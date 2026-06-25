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

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  constructor(private messageService: MessageService) {}

  afterInit(server: any) {
    console.log('CHATGATEWAY INIT: ', server);
  }

  handleConnection(client: Socket) {
    console.log('CHATGATEWAY CONNECTED: ', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('CHATGATEWAY DISCONNECTED: ', client.id);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    client.join(data.conversationId);
    console.log(`Client ${client.id} joined room ${data.conversationId}`);
    client.to(data.conversationId).emit('status', 'Active');
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @MessageBody() data: { conversationId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(data.conversationId);
    console.log(`Client ${client.id} left room ${data.conversationId}`);
    client.to(data.conversationId).emit('status', 'Inactive');
  }

  @SubscribeMessage('sendMessage')
  async sendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      senderId: number;
      conversationId: string;
      message: string;
    },
  ) {
    const createdMessage = await this.messageService.create(
      data.senderId,
      data.conversationId,
      data.message,
    );

    client.to(data.conversationId).emit('receiveMessage', createdMessage);
    return createdMessage;
  }
}
