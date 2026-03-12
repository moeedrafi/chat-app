import { FriendRequestStatus } from 'src/enum';
import { Expose, Transform } from 'class-transformer';

export class FriendRequestDTO {
  @Expose()
  id: string;

  @Expose()
  status: FriendRequestStatus;

  @Expose()
  @Transform(({ obj }) => obj.sender.id)
  senderId: number;

  @Expose()
  @Transform(({ obj }) => obj.receiver.username)
  receiver: string;
}
