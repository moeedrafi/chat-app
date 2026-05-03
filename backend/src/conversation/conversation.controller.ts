import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { ConversationService } from 'src/conversation/conversation.service';

@Controller('conversation')
export class ConversationController {
  constructor(private conversationService: ConversationService) {}

  @Post()
  createConversation(
    @CurrentUser() user: { sub: number },
    @Param('friendid', ParseIntPipe) friendId: number,
  ) {
    return this.conversationService.create(user.sub, friendId);
  }

  @Get(':friendid')
  getConversation(
    @CurrentUser() user: { sub: number },
    @Param('friendid', ParseIntPipe) friendId: number,
  ) {
    return this.conversationService.findOne(user.sub, friendId);
  }

  @Get()
  getAllConversations(@CurrentUser() user: { sub: number }) {
    return this.conversationService.findAll(user.sub);
  }

  @Delete(':conversationid/hard')
  hardRemoveFriend(
    @CurrentUser() user: { sub: number },
    @Param('conversationid') conversationId: string,
  ) {
    return this.conversationService.hardRemove(user.sub, conversationId);
  }
}
