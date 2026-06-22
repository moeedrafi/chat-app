import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { FriendModule } from 'src/friend/friend.module';
import { FriendRequest } from 'src/friend-request/friend-request.entity';
import { FriendRequestService } from 'src/friend-request/friend-request.service';
import { FriendRequestController } from 'src/friend-request/friend-request.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([FriendRequest]),
    UserModule,
    FriendModule,
  ],
  controllers: [FriendRequestController],
  providers: [FriendRequestService],
  exports: [FriendRequestService],
})
export class FriendRequestModule {}
