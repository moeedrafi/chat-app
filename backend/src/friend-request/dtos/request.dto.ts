import { Expose, Transform } from 'class-transformer';
import { FriendRequestStatus } from 'src/enum';

export class FriendRequestDTO {
  @Expose()
  id: string;

  @Expose()
  status: FriendRequestStatus;

  @Expose()
  @Transform(({ obj }) => obj.sender.id)
  senderId: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
