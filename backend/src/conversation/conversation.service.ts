import { Repository, DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Conversation } from 'src/conversation/conversation.entity';
import { FriendRequestService } from 'src/friend-request/friend-request.service';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation) private repo: Repository<Conversation>,
    private readonly dataSource: DataSource,
    private readonly friendRequestService: FriendRequestService,
  ) {}

  async create(currentUserId: number, friendId: number) {
    const conversation = this.repo.create({
      participants: [
        { user: { id: currentUserId } },
        { user: { id: friendId } },
      ],
    });

    await this.repo.save(conversation);
    return conversation;
  }

  async findOne(currentUserId: number, friendId: number) {
    await this.friendRequestService.findFriend(currentUserId, friendId);

    const existingConversation = await this.repo
      .createQueryBuilder('conversation')
      .leftJoinAndSelect('conversation.participants', 'participant')
      .leftJoinAndSelect('participant.user', 'user')
      .where('user.id IN (:...ids)', { ids: [currentUserId, friendId] })
      .andWhere('participant.active = true')
      .groupBy('conversation.id')
      .having('COUNT(user.id) = 2')
      .getOne();

    if (existingConversation) {
      return {
        data: existingConversation,
        message: 'Fetched conversation successfully',
      };
    }

    const conversation = await this.create(currentUserId, friendId);
    const savedConversation = await this.repo.findOne({
      where: { id: conversation.id },
      relations: ['participants', 'participants.user'],
    });

    return {
      data: savedConversation,
      message: 'Conversation created successfully',
    };
  }

  async hardRemove(userId: number, conversationId: string) {
    return await this.dataSource.transaction(async (manager) => {
      const conversation = await this.repo.findOne({
        where: { id: conversationId },
        relations: ['participants', 'participants.user'],
      });

      if (!conversation) {
        throw new NotFoundException('conversation not found');
      }

      const isParticipant = conversation.participants.some(
        (p) => p.user.id === userId,
      );
      if (!isParticipant) {
        throw new NotFoundException(
          'You are not a participant in this conversation',
        );
      }

      await manager.remove(Conversation, conversation);
      return { message: 'Convesation Deleted for all participants' };
    });
  }
}
