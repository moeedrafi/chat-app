import { Controller, Delete, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { UserDto } from 'src/user/user.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { ConversationService } from 'src/conversation/conversation.service';

@Controller('conversation')
export class ConversationController {
  constructor(private conversationService: ConversationService) {}

  @Serialize(UserDto)
  @Get(':conversationId/user')
  getConversationUser(
    @CurrentUser() user: { sub: number },
    @Param('conversationId', ParseUUIDPipe) conversationId: string,
  ) {
    return this.conversationService.getUserInformation(
      user.sub,
      conversationId,
    );
  }

  @Get()
  getAllConversations(@CurrentUser() user: { sub: number }) {
    return this.conversationService.findAll(user.sub);
  }

  @Get(':conversationId')
  getConversation(
    @Param('conversationId', ParseUUIDPipe) conversationId: string,
  ) {
    return this.conversationService.findOne(conversationId);
  }

  @Delete(':conversationid/hard')
  hardRemoveFriend(
    @CurrentUser() user: { sub: number },
    @Param('conversationid') conversationId: string,
  ) {
    return this.conversationService.hardRemove(user.sub, conversationId);
  }
}
