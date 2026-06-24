import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Friend } from 'src/friend/friend.entity';
import { UserService } from 'src/user/user.service';
import { ConversationService } from 'src/conversation/conversation.service';

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(Friend) private repo: Repository<Friend>,
    private readonly dataSource: DataSource,
    private readonly userService: UserService,
    private readonly conversationService: ConversationService,
  ) {}

  async create(currentUserId: number, friendId: number) {
    if (currentUserId === friendId) {
      throw new BadRequestException('You cannot add yourself as a friend');
    }

    try {
      await this.dataSource.transaction(async (manager) => {
        const conversationId = await this.conversationService.create(
          currentUserId,
          friendId,
          manager,
        );

        const friendRepo = manager.getRepository(Friend);
        const friend = friendRepo.create({
          userBId: friendId,
          userAId: currentUserId,
          conversationId: conversationId,
        });

        await friendRepo.save(friend);
      });
    } catch (error: any) {
      // PostgreSQL unique violation
      if (error.code === '23505') {
        throw new ConflictException('Friendship already exists');
      }

      throw error;
    }
  }

  async findAll(currentUserId: number) {
    const friends = await this.repo.find({
      where: [{ userAId: currentUserId }, { userBId: currentUserId }],
    });

    const otherUserIds = friends.map((friend) =>
      friend.userAId === currentUserId ? friend.userBId : friend.userAId,
    );

    // remove duplicates
    const users = await this.userService.findByIds([...new Set(otherUserIds)]);
    const usersMap = new Map(users.map((user) => [user.id, user]));

    const data = friends.map((friend) => {
      const otherUserId =
        friend.userAId === currentUserId ? friend.userBId : friend.userAId;

      const { username } = usersMap.get(otherUserId) ?? {};

      return {
        username,
        id: friend.id,
        userId: otherUserId,
        conversationId: friend.conversationId,
      };
    });

    return { data, message: 'Fetched friends' };
  }

  remove(currentUser: number, friendId: number) {
    // TODO: Remove conversation
  }

  async findOne(userId: number, username: string) {
    const otherUser = await this.userService.findByUsername(username, [
      'id',
      'email',
      'username',
    ]);
    if (!otherUser) throw new NotFoundException('user not found');

    const ids = [userId, otherUser.id].sort((a, b) => a - b);
    const friendshipKey = `${ids[0]}_${ids[1]}`;

    const friendship = await this.repo.findOne({
      where: { friendshipKey },
    });

    if (!friendship) {
      throw new ForbiddenException('Cannot find friend');
    }

    return {
      data: { ...friendship, ...otherUser },
      message: 'Friend found successfully',
    };
  }
}
