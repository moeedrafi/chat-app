import { Expose, Type } from 'class-transformer';
import { MessageStatus } from 'src/enum';
import { UserDto } from 'src/user/user.dto';

export class MessagesDTO {
  @Expose()
  id: string;

  @Expose()
  created_at: string;

  @Expose()
  message: string;

  @Expose()
  seen_at: string;

  @Expose()
  status: MessageStatus;

  @Expose()
  @Type(() => UserDto)
  sender: UserDto;
}
