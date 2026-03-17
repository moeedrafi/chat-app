import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConversationParticipant } from 'src/conversation-participant/conversation-participant.entity';

@Injectable()
export class ConversationParticipantService {
  constructor(
    @InjectRepository(ConversationParticipant)
    private repo: Repository<ConversationParticipant>,
  ) {}

  async remove(userId: number, conversationId: string) {
    const participant = await this.repo.findOne({
      where: { conversation: { id: conversationId }, user: { id: userId } },
    });

    if (!participant) {
      throw new NotFoundException('Conversation not found for this user');
    }

    participant.active = false;
    await this.repo.save(participant);

    return { message: 'Conversation deleted for this user' };
  }
}
