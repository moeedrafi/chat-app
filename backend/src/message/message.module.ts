import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from 'src/message/message.entity';
import { MessageService } from 'src/message/message.service';
import { MessageController } from 'src/message/message.controller';
import { ConversationModule } from 'src/conversation/conversation.module';

@Module({
  imports: [TypeOrmModule.forFeature([Message]), ConversationModule],
  controllers: [MessageController],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}
