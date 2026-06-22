import { Repository, DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Conversation } from 'src/conversation/conversation.entity';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation) private repo: Repository<Conversation>,
    private readonly dataSource: DataSource,
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
    // await this.friendRequestService.findFriend(currentUserId, friendId);

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

  async findById(conversationId: string, currentUserId: number) {
    const conversation = await this.repo.findOne({
      where: { id: conversationId },
      relations: ['participants', 'participants.user'],
    });
    if (!conversation) {
      throw new NotFoundException('conversation not found');
    }

    const isParticipant = conversation.participants.some(
      (p) => p.user.id === currentUserId,
    );
    if (!isParticipant) {
      throw new NotFoundException(
        'You are not a participant in this conversation',
      );
    }

    return conversation;
  }

  async hardRemove(userId: number, conversationId: string) {
    return await this.dataSource.transaction(async (manager) => {
      const conversation = await this.findById(conversationId, userId);

      await manager.remove(Conversation, conversation);
      return { message: 'Convesation Deleted for all participants' };
    });
  }

  async findAll(userId: number) {
    // const friends = await this.friendRequestService.findAll(userId);
    // const friendIds = friends.map((fr) => {
    //   return fr.sender.id === userId ? fr.receiver.id : fr.sender.id;
    // });
    // const existingConversation = await this.repo
    //   .createQueryBuilder('conversation')
    //   .innerJoin('conversation.participants', 'p1')
    //   .innerJoin('p1.user', 'u1')
    //   .innerJoin('conversation.participants', 'p2')
    //   .innerJoin('p2.user', 'u2')
    //   .where('u1.id = :userId', { userId })
    //   .andWhere('u2.id IN (:...friendIds)', { friendIds })
    //   .andWhere('p1.active = true')
    //   .andWhere('p2.active = true')
    //   .getMany();
    // if (existingConversation) {
    //   return existingConversation;
    // }
    // for (const friendId of friendIds) {
    //   return this.create(userId, friendId);
    // }
  }
}
