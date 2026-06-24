import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friend } from 'src/friend/friend.entity';
import { UserModule } from 'src/user/user.module';
import { FriendService } from 'src/friend/friend.service';
import { FriendController } from 'src/friend/friend.controller';
import { ConversationModule } from 'src/conversation/conversation.module';

@Module({
  imports: [TypeOrmModule.forFeature([Friend]), UserModule, ConversationModule],
  controllers: [FriendController],
  providers: [FriendService],
  exports: [FriendService],
})
export class FriendModule {}
