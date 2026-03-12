import { Repository } from 'typeorm';
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

  async findOne(username: string, select?: (keyof User)[]) {
    return this.repo.findOne({
      where: { username },
      select,
    });
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
}
