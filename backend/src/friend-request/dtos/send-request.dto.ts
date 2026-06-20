import { IsNumber } from 'class-validator';

export class SendRequestDTO {
  @IsNumber()
  userId: number;
}
