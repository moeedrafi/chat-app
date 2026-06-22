import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friend } from 'src/friend/friend.entity';
import { UserModule } from 'src/user/user.module';
import { FriendService } from 'src/friend/friend.service';
import { FriendController } from 'src/friend/friend.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Friend]), UserModule],
  controllers: [FriendController],
  providers: [FriendService],
  exports: [FriendService],
})
export class FriendModule {}
