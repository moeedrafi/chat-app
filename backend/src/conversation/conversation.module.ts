import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from 'src/conversation/conversation.entity';
import { ConversationService } from 'src/conversation/conversation.service';
import { FriendRequestModule } from 'src/friend-request/friend-request.module';
import { ConversationController } from 'src/conversation/conversation.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Conversation]), FriendRequestModule],
  controllers: [ConversationController],
  providers: [ConversationService],
  exports: [ConversationService],
})
export class ConversationModule {}
