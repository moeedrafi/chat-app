import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiResponseDto } from 'src/types';
import { UserService } from 'src/user/user.service';
import { FriendService } from 'src/friend/friend.service';
import { FriendRequest } from 'src/friend-request/friend-request.entity';
import { PendingRequestDTO } from 'src/friend-request/dtos/pending-request.dto';

@Injectable()
export class FriendRequestService {
  constructor(
    @InjectRepository(FriendRequest) private repo: Repository<FriendRequest>,
    private readonly userService: UserService,
    private readonly friendService: FriendService,
  ) {}

  async send(senderId: number, receiverId: number) {
    if (senderId === receiverId) {
      throw new ForbiddenException('cannot send a req to yourself');
    }

    const receiver = await this.userService.findById(receiverId);
    if (!receiver) throw new NotFoundException('receiver not exists');

    const existingRequest = await this.repo.findOne({
      where: { senderId, receiverId },
    });
    if (existingRequest) {
      throw new ForbiddenException('already a request is sent');
    }

    const request = this.repo.create({ receiverId, senderId });
    const savedRequest = await this.repo.save(request);

    return { data: savedRequest, message: 'Request sent successfully' };
  }

  async accept(receiverId: number, friendId: number) {
    await this.remove(receiverId, friendId);
    await this.friendService.create(receiverId, friendId);

    return { message: 'Request accepted successfully' };
  }

  async remove(receiverId: number, friendId: number) {
    const sender = await this.userService.findById(friendId, {
      select: ['id'],
    });
    if (!sender) throw new NotFoundException('sender not exists');

    const existingRequest = await this.repo.findOne({
      where: { senderId: sender.id, receiverId },
    });
    if (!existingRequest) {
      throw new ForbiddenException('request doesnt exists');
    }

    await this.repo.delete(existingRequest.id);
    return { message: 'Request denied successfully' };
  }

  async pending(userId: number): Promise<ApiResponseDto<PendingRequestDTO[]>> {
    const pendingRequests = await this.repo.find({
      where: { receiverId: userId },
    });

    const senderIds = [...new Set(pendingRequests.map((r) => r.senderId))];

    const senderUsers = await this.userService.findByIds(senderIds);
    const usersMap = new Map(senderUsers.map((u) => [u.id, u]));

    return {
      data: pendingRequests.map((request) => ({
        id: request.id,
        sender: usersMap.get(request.senderId)!,
      })),
      message: 'Pending request fetched',
    };
  }
}
