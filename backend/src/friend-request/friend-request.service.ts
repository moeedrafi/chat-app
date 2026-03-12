import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendRequestStatus } from 'src/enum';
import { UserService } from 'src/user/user.service';
import { FriendRequest } from 'src/friend-request/friend-request.entity';
import { ConversationService } from 'src/conversation/conversation.service';

@Injectable()
export class FriendRequestService {
  constructor(
    @InjectRepository(FriendRequest) private repo: Repository<FriendRequest>,
    private readonly userService: UserService,
    private readonly conversationService: ConversationService,
  ) {}

  async send(senderId: number, sentTo: string) {
    const receiver = await this.userService.findOne(sentTo, ['id', 'username']);
    if (!receiver) throw new NotFoundException('receiver not exists');

    if (senderId === receiver.id) {
      throw new ForbiddenException('cannot send a req to yourself');
    }

    const existingRequest = await this.repo.findOne({
      where: { sender: { id: senderId }, receiver: { id: receiver.id } },
    });
    if (existingRequest) {
      throw new ForbiddenException('already a request is sent');
    }

    const request = this.repo.create({
      receiver,
      sender: { id: senderId },
    });

    const savedRequest = await this.repo.save(request);

    return { data: savedRequest, message: 'Request sent successfully' };
  }

  async remove(senderId: number, friendId: number) {
    const request = await this.repo.findOne({
      where: [
        { sender: { id: senderId }, receiver: { id: friendId } },
        { sender: { id: friendId }, receiver: { id: senderId } },
      ],
    });

    if (!request) {
      throw new NotFoundException('no friend found');
    }

    if (request.status !== FriendRequestStatus.ACCEPTED) {
      throw new NotFoundException('not a friend');
    }

    await this.repo.remove(request);
    // await this.conversationService.remove(senderId, friendId);

    return { message: 'Removed friend and conversation successfully' };
  }
}
