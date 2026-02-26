import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendRequest } from 'src/friend-request/friend-request.entity';
import { FriendRequestService } from 'src/friend-request/friend-request.service';
import { FriendRequestController } from 'src/friend-request/friend-request.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FriendRequest])],
  controllers: [FriendRequestController],
  providers: [FriendRequestService],
})
export class FriendRequestModule {}
