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

@WebSocketGateway(8080, { cors: { origin: '*' } })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  constructor(private messageService: MessageService) {}

  messages = [
    { id: 1, message: 'NEW ONE?' },
    { id: 2, mesage: 'NO WAY' },
  ];

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
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.roomId);
    console.log(`Client ${client.id} joined room ${data.roomId}`);

    const createdMessage = [
      { id: '1', message: 'NEW ONE?' },
      { id: '2', mesage: 'NO WAY' },
    ];

    return this.messages;
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(data.roomId);
    console.log(`Client ${client.id} left room ${data.roomId}`);
    return { ok: true };
  }

  @SubscribeMessage('sendMessage')
  async sendMessage(
    @MessageBody()
    data: {
      senderId: number;
      conversationId: string;
      message: string;
    },
  ) {
    console.log(
      'send message: ' + data.message + ' at: ' + data.conversationId,
    );

    // message service createCreate
    // const createdMessage = await this.messageService.create(
    //   data.senderId,
    //   data.conversationId,
    //   data.message,
    // );

    const createdMessage = { id: Math.random(), message: data.message };
    this.messages.push(createdMessage);

    this.server.to(data.conversationId).emit('receiveMessage', createdMessage);
  }
}
