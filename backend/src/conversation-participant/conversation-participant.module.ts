import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationParticipantController } from 'src/conversation-participant/conversation-participant.controller';
import { ConversationParticipantService } from 'src/conversation-participant/conversation-participant.service';
import { ConversationParticipant } from 'src/conversation-participant/conversation-participant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ConversationParticipant])],
  controllers: [ConversationParticipantController],
  providers: [ConversationParticipantService],
})
export class ConversationParticipantModule {}
