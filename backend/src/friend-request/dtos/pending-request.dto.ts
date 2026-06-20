import { UserDto } from 'src/user/user.dto';
import { FriendRequestStatus } from 'src/enum';
import { Expose, Type } from 'class-transformer';

export class PendingRequestDTO {
  @Expose()
  id: string;

  @Expose()
  status: FriendRequestStatus;

  @Expose()
  @Type(() => UserDto)
  sender: UserDto;
}
