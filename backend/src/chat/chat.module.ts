import { Module } from '@nestjs/common';
import { ChatGateway } from 'src/chat/chat.gateway';
import { MessageModule } from 'src/message/message.module';

@Module({ providers: [ChatGateway], imports: [MessageModule] })
export class ChatModule {}
