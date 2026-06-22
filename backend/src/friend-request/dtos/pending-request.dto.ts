import { UserDto } from 'src/user/user.dto';
import { Expose, Type } from 'class-transformer';

export class PendingRequestDTO {
  @Expose()
  id: string;

  @Expose()
  @Type(() => UserDto)
  sender: UserDto;
}
