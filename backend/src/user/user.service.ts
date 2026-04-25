import { ILike, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { FriendRequestStatus } from 'src/enum';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async findOne(email: string, select?: (keyof User)[]) {
    return this.repo.findOne({
      where: { email },
      select,
    });
  }

  async findByUsername(username: string, select?: (keyof User)[]) {
    return this.repo.findOne({
      where: { username },
      select,
    });
  }

  async searchUsers(userId: number, username: string) {
    const users = await this.repo
      .createQueryBuilder('user')
      .where('user.username ILIKE :username', { username: `%${username}%` })
      .andWhere('user.id != :userId', { userId })
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('1')
          .from('friend_request', 'f')
          .where(
            `(
            (f.sender_id = :senderId AND f.receiver_id = user.id)
            OR
            (f.sender_id = user.id AND f.receiver_id = :receiverId)
          )`,
          )
          .andWhere('f.status = :status')
          .getQuery();

        return `NOT EXISTS ${subQuery}`;
      })
      .setParameters({
        userId,
        senderId: userId,
        receiverId: userId,
        status: FriendRequestStatus.ACCEPTED,
      })
      .select(['user.id', 'user.email', 'user.username'])
      .getMany();

    return { data: users, message: 'Fetched users' };
  }

  async findById(
    id: number,
    options?: { relations?: string[]; select?: (keyof User)[] },
  ) {
    return this.repo.findOne({
      where: { id },
      select: options?.select,
      relations: options?.relations,
    });
  }

  async create(email: string, password: string, username: string) {
    const user = this.repo.create({
      email,
      password,
      username,
    });

    return this.repo.save(user);
  }

  async update(id: number, attr: Partial<User>) {
    const result = await this.repo.update(id, attr);

    if (result.affected === 0) throw new NotFoundException('User not found');
    return result;
  }

  async update2(id: number, attr: Partial<User>) {
    if (!id) throw new BadRequestException('user id is required');

    const user = await this.repo.findOneBy({ id });
    if (!user) throw new NotFoundException('user not found');

    Object.assign(user, attr);

    const updatedUser = await this.repo.save(user);

    return {
      data: updatedUser,
      message: 'User Updated Successfully!',
    };
  }

  async findByResetToken(tokenHash: string) {
    return this.repo.findOne({ where: { resetToken: tokenHash } });
  }

  async save(user: User) {
    return this.repo.save(user);
  }

  async updateRefreshToken(id: number, hashedToken: string) {
    await this.repo.update(id, { refreshToken: hashedToken });
  }
}
