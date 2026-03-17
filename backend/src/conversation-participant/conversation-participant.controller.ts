import { Controller, Delete, Param, ParseUUIDPipe } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { ConversationParticipantService } from 'src/conversation-participant/conversation-participant.service';

@Controller('conversation-participant')
export class ConversationParticipantController {
  constructor(
    private readonly conversationParticipant: ConversationParticipantService,
  ) {}

  @Delete(':conversationid')
  removeFriend(
    @CurrentUser() user: { sub: number },
    @Param('conversationid', ParseUUIDPipe) conversationId: string,
  ) {
    return this.conversationParticipant.remove(user.sub, conversationId);
  }
}
