import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/user/user.entity';

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
      .leftJoin(
        'friend_request',
        'fr',
        `(
        (fr.senderId = :userId AND fr.receiverId = user.id)
        OR
        (fr.senderId = user.id AND fr.receiverId = :userId)
      )`,
      )
      .leftJoin(
        'friend',
        'f',
        `(
        (f.userAId = :userId AND f.userBId = user.id)
        OR
        (f.userAId = user.id AND f.userBId = :userId)
      )`,
      )
      .where('user.username ILIKE :username', { username: `%${username}%` })
      .andWhere('user.id != :userId', { userId })
      .select([
        'user.id AS "id"',
        'user.email AS "email"',
        'user.username AS "username"',
      ])
      .addSelect(
        `
          CASE
            WHEN f.id IS NOT NULL THEN 'FRIENDS'
            WHEN fr.id IS NOT NULL THEN 'PENDING'
            ELSE 'NONE'
          END
        `,
        'relationshipStatus',
      )
      .setParameter('userId', userId)
      .getRawMany();

    return { data: users, message: 'Fetched users' };
  }

  async getLoggedInUserInformation(userId: number) {
    const user = await this.findById(userId, {
      select: ['id', 'username', 'email'],
    });

    return { data: user, message: 'fetched logged in user' };
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

  async findByIds(ids: number[]) {
    return this.repo.find({
      where: { id: In(ids) },
    });
  }
}
