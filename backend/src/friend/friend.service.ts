import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Friend } from 'src/friend/friend.entity';

@Injectable()
export class FriendService {
  constructor(@InjectRepository(Friend) private repo: Repository<Friend>) {}

  create() {}

  findAll(currentUser: number) {}

  remove(currentUser: number, friendId: number) {}
}
