import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { MessageStatus } from 'src/enum';
import { Message } from 'src/message/message.entity';
import { ConversationService } from 'src/conversation/conversation.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message) private repo: Repository<Message>,
    private readonly conversationService: ConversationService,
  ) {}

  async create(senderId: number, conversationId: string, message: string) {
    const conversation = await this.conversationService.findById(
      conversationId,
      senderId,
    );

    if (!conversation) {
      throw new NotFoundException('conversation doesnt exists');
    }

    const createdMessage = this.repo.create({
      message,
      conversation: { id: conversationId },
      sender: { id: senderId },
    });

    return await this.repo.save(createdMessage);
  }

  async remove(senderId: number, messageId: string) {
    const message = await this.repo.findOne({
      where: { id: messageId, sender: { id: senderId } },
    });

    if (!message) {
      throw new NotFoundException('message not found');
    }

    const deletedMessage = await this.repo.remove(message);

    return {
      data: deletedMessage,
      message: 'Message deleted successfully',
    };
  }

  async seen(userId: number, conversationId: string) {
    const conversation = await this.conversationService.findById(
      conversationId,
      userId,
    );

    const users = conversation.participants.map((u) => u.user.id);
    // await this.friendRequestService.findFriend(users[0], users[1]);

    // const unseenMessage = await this.repo.find({
    //   where: {
    //     conversation: { id: conversationId },
    //     sender: Not(userId),
    //     seen_at: IsNull(),
    //   },
    // });

    // await this.repo.update(
    //   { id: In(unseenMessage.map((m) => m.id)) },
    //   { seen_at: new Date(), status: MessageStatus.READ },
    // );

    await this.repo
      .createQueryBuilder()
      .update(Message)
      .set({ seen_at: () => 'CURRENT_TIMESTAMP', status: MessageStatus.READ })
      .where('conversation_id = :conversationId', { conversationId })
      .andWhere('sender_id != :userId', { userId })
      .andWhere('seen_at IS NULL')
      .execute();

    return { message: 'Messages marked as seen' };
  }

  async findAll(conversationId: string) {
    const messages = await this.repo.find({
      where: { conversation: { id: conversationId } },
      relations: { sender: true },
    });

    return { data: messages, message: 'Fetched messages successfully' };
  }

  async update(senderId: number, messageId: string, newMessage: string) {
    const message = await this.repo.findOne({
      where: { id: messageId, sender: { id: senderId } },
    });

    if (!message) throw new NotFoundException('message not found');

    message.message = newMessage;
    await this.repo.save(message);

    return {
      data: message,
      message: 'Message Updated Successfully!',
    };
  }
}
