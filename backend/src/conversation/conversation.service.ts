import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Conversation } from 'src/conversation/conversation.entity';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation) private repo: Repository<Conversation>,
  ) {}

  async remove(userA: number, userB: number) {
    const conversation = await this.repo
      .createQueryBuilder('conversation')
      .leftJoinAndSelect('conversation.participants', 'participant')
      .where('participant.userId IN (:..ids)', { ids: [userA, userB] })
      .groupBy('conversation.id')
      .having('COUNT(participant.id) = 2')
      .getOne();

    if (!conversation) {
      throw new NotFoundException('convo not found');
    }

    await this.repo.remove(conversation);
  }
}
