import { Expose } from 'class-transformer';

export class FriendRequestDTO {
  @Expose()
  id: string;

  @Expose()
  senderId: number;

  @Expose()
  receiverId: string;
}
