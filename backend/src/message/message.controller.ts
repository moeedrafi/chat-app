import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { MessagesDTO } from 'src/message/dtos/messages.dto';
import { MessageService } from 'src/message/message.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';

@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Post(':conversationid')
  sendMessage(
    @CurrentUser() user: { sub: number },
    @Param('conversationid', ParseUUIDPipe) conversationId: string,
    @Body() body: { message: string },
  ) {
    return this.messageService.create(user.sub, conversationId, body.message);
  }

  @Delete(':conversationid/:messageid')
  removeMessage(
    @CurrentUser() user: { sub: number },
    @Param('conversationid', ParseUUIDPipe) conversationId: string,
    @Param('messageid', ParseUUIDPipe) messageId: string,
  ) {
    return this.messageService.remove(user.sub, conversationId, messageId);
  }

  @Patch(':conversationid')
  seenMessage(
    @CurrentUser() user: { sub: number },
    @Param('conversationid', ParseUUIDPipe) conversationId: string,
  ) {
    return this.messageService.seen(user.sub, conversationId);
  }

  @Serialize(MessagesDTO)
  @Get(':conversationid')
  getMessages(@Param('conversationid', ParseUUIDPipe) conversationId: string) {
    return this.messageService.findAll(conversationId);
  }
}
