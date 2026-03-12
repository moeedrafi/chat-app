import { IsString } from 'class-validator';

export class SendRequestDTO {
  @IsString()
  username: string;
}
