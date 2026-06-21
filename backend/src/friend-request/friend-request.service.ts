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
import { ApiResponseDto } from 'src/types';
import { PendingRequestDTO } from './dtos/pending-request.dto';

@Injectable()
export class FriendRequestService {
  constructor(
    @InjectRepository(FriendRequest) private repo: Repository<FriendRequest>,
    private readonly userService: UserService,
  ) {}

  async send(senderId: number, receiverId: number) {
    if (senderId === receiverId) {
      throw new ForbiddenException('cannot send a req to yourself');
    }

    const receiver = await this.userService.findById(receiverId);
    if (!receiver) throw new NotFoundException('receiver not exists');

    const existingRequest = await this.repo.findOne({
      where: { sender: { id: senderId }, receiver: { id: receiverId } },
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

  async accept(receiverId: number, friendId: number) {
    const sender = await this.userService.findById(friendId, {
      select: ['id'],
    });
    if (!sender) throw new NotFoundException('sender not exists');

    const existingRequest = await this.repo.findOne({
      where: { sender: { id: sender.id }, receiver: { id: receiverId } },
    });
    if (!existingRequest) {
      throw new ForbiddenException('request doesnt exists');
    }

    await this.repo.update(existingRequest.id, {
      status: FriendRequestStatus.ACCEPTED,
    });

    return { message: 'Request accepted successfully' };
  }

  async remove(receiverId: number, friendId: number) {
    const sender = await this.userService.findById(friendId, {
      select: ['id'],
    });
    if (!sender) throw new NotFoundException('sender not exists');

    const existingRequest = await this.repo.findOne({
      where: { sender: { id: sender.id }, receiver: { id: receiverId } },
    });
    if (!existingRequest) {
      throw new ForbiddenException('request doesnt exists');
    }

    await this.repo.update(existingRequest.id, {
      status: FriendRequestStatus.REJECTED,
    });

    return { message: 'Request denied successfully' };
  }

  findAll(userId: number) {
    return this.repo.find({
      where: [
        { sender: { id: userId }, status: FriendRequestStatus.ACCEPTED },
        { receiver: { id: userId }, status: FriendRequestStatus.ACCEPTED },
      ],
      relations: ['sender', 'receiver'],
    });

    //   return this.repo
    // .createQueryBuilder('fr')
    // .leftJoinAndSelect('fr.sender', 'sender')
    // .leftJoinAndSelect('fr.receiver', 'receiver')
    // .where('(sender.id = :userId OR receiver.id = :userId) AND fr.status = :status', {
    //   userId,
    //   status: FriendRequestStatus.ACCEPTED,
    // })
    // .getMany();

    //   return this.repo
    // .createQueryBuilder('fr')
    // .leftJoin('fr.sender', 'sender')
    // .leftJoin('fr.receiver', 'receiver')
    // .select([
    //   'CASE WHEN sender.id = :userId THEN receiver.id ELSE sender.id END AS friendId',
    //   'CASE WHEN sender.id = :userId THEN receiver.name ELSE sender.name END AS friendName',
    // ])
    // .where('(sender.id = :userId OR receiver.id = :userId) AND fr.status = :status', {
    //   userId,
    //   status: FriendRequestStatus.ACCEPTED,
    // })
    // .getRawMany();
  }

  async findFriend(userId: number, friendId: number) {
    const friendship = await this.repo.findOne({
      where: [
        {
          sender: { id: userId },
          receiver: { id: friendId },
          status: FriendRequestStatus.ACCEPTED,
        },
        {
          sender: { id: friendId },
          receiver: { id: userId },
          status: FriendRequestStatus.ACCEPTED,
        },
      ],
    });

    if (!friendship) {
      throw new ForbiddenException(
        'Cannot create a conversation: users are not friends',
      );
    }
  }

  async pending(userId: number): Promise<ApiResponseDto<PendingRequestDTO[]>> {
    const pendingRequests = await this.repo.find({
      where: { receiver: { id: userId }, status: FriendRequestStatus.PENDING },
      relations: { sender: true },
    });

    return { data: pendingRequests, message: 'Pending request fetched' };
  }
}
