import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { FriendRequest } from 'src/friend-request/friend-request.entity';
import { ConversationModule } from 'src/conversation/conversation.module';
import { FriendRequestService } from 'src/friend-request/friend-request.service';
import { FriendRequestController } from 'src/friend-request/friend-request.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([FriendRequest]),
    UserModule,
    ConversationModule,
  ],
  controllers: [FriendRequestController],
  providers: [FriendRequestService],
})
export class FriendRequestModule {}
