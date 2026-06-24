import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Conversation } from 'src/conversation/conversation.entity';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation) private repo: Repository<Conversation>,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    currentUserId: number,
    friendId: number,
    manager: EntityManager,
  ) {
    const conversationRepo = manager.getRepository(Conversation);

    const conversation = conversationRepo.create({
      participants: [
        { user: { id: currentUserId } },
        { user: { id: friendId } },
      ],
    });

    await conversationRepo.save(conversation);
    return conversation.id;
  }

  async getUserInformation(currentUserId: number, conversationId: string) {
    const existingConversation = await this.repo.findOne({
      where: { id: conversationId },
      relations: { participants: { user: true } },
    });

    if (!existingConversation) {
      throw new NotFoundException('Conversation not exists');
    }

    const otherParticipant = existingConversation.participants.find(
      (participant) => participant.user.id !== currentUserId,
    )?.user;

    return { data: otherParticipant, message: 'Fetched user information' };
  }

  async findOne(conversationId: string) {
    const existingConversation = await this.repo.findOne({
      where: { id: conversationId },
    });

    if (!existingConversation) {
      throw new NotFoundException('Conversation not exists');
    }

    return { data: existingConversation, message: 'Fetched user information' };
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
    const conversation = await this.findById(conversationId, userId);
    await this.repo.remove(conversation);
    return { message: 'Convesation Deleted for all participants' };
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
