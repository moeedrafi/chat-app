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
import { UpdateMessageDTO } from 'src/message/dtos/update-message.dto';
import { CreateMessageDTO } from 'src/message/dtos/create-message.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';

@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Post(':conversationid')
  sendMessage(
    @CurrentUser() user: { sub: number },
    @Param('conversationid', ParseUUIDPipe) conversationId: string,
    @Body() body: CreateMessageDTO,
  ) {
    return this.messageService.create(user.sub, conversationId, body.message);
  }

  @Delete(':messageid')
  removeMessage(
    @CurrentUser() user: { sub: number },
    @Param('messageid', ParseUUIDPipe) messageId: string,
  ) {
    return this.messageService.remove(user.sub, messageId);
  }

  @Patch(':conversationid/seen')
  seenMessage(
    @CurrentUser() user: { sub: number },
    @Param('conversationid', ParseUUIDPipe) conversationId: string,
  ) {
    return this.messageService.seen(user.sub, conversationId);
  }

  @Patch(':messageid')
  updateMessage(
    @CurrentUser() user: { sub: number },
    @Param('messageid', ParseUUIDPipe) messageId: string,
    @Body() body: UpdateMessageDTO,
  ) {
    return this.messageService.update(user.sub, messageId, body.message);
  }

  @Serialize(MessagesDTO)
  @Get(':conversationid')
  getMessages(@Param('conversationid', ParseUUIDPipe) conversationId: string) {
    return this.messageService.findAll(conversationId);
  }
}
