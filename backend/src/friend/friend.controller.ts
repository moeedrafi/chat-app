import { Controller, Delete, Get, Param, ParseIntPipe } from '@nestjs/common';
import { FriendService } from 'src/friend/friend.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('friend')
export class FriendController {
  constructor(private friendService: FriendService) {}

  @Delete(':friendid')
  removeFriend(
    @CurrentUser() user: { sub: number },
    @Param('friendid', ParseIntPipe) friendId: number,
  ) {
    return this.friendService.remove(user.sub, friendId);
  }

  @Get('username')
  getSingleFriend(
    @CurrentUser() user: { sub: number },
    @Param('username') username: string,
  ) {
    return this.friendService.findOne(user.sub, username);
  }

  @Get()
  getFriends(@CurrentUser() user: { sub: number }) {
    return this.friendService.findAll(user.sub);
  }
}
