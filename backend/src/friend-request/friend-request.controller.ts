import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { SendRequestDTO } from 'src/friend-request/dtos/send-request.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { FriendRequestDTO } from 'src/friend-request/dtos/friend-request.dto';
import { FriendRequestService } from 'src/friend-request/friend-request.service';
import { PendingRequestDTO } from 'src/friend-request/dtos/pending-request.dto';

@Controller('friend-request')
export class FriendRequestController {
  constructor(private friendRequestService: FriendRequestService) {}

  @Serialize(FriendRequestDTO)
  @Post()
  sendRequest(
    @Body() body: SendRequestDTO,
    @CurrentUser() user: { sub: number },
  ) {
    return this.friendRequestService.send(user.sub, body.userId);
  }

  @Delete(':friendid')
  removeFriend(
    @CurrentUser() user: { sub: number },
    @Param('friendid', ParseIntPipe) friendId: number,
  ) {
    return this.friendRequestService.remove(user.sub, friendId);
  }

  @Post(':friendid')
  acceptRequest(
    @CurrentUser() user: { sub: number },
    @Param('friendid', ParseIntPipe) friendId: number,
  ) {
    return this.friendRequestService.accept(user.sub, friendId);
  }

  @Serialize(PendingRequestDTO)
  @Get('pending')
  getPendingRequests(@CurrentUser() user: { sub: number }) {
    return this.friendRequestService.pending(user.sub);
  }

  @Get()
  getFriends(@CurrentUser() user: { sub: number }) {
    return this.friendRequestService.findAll(user.sub);
  }
}
