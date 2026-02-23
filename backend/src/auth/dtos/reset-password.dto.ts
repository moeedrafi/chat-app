import { IsString } from 'class-validator';

export class ResetPasswordDTO {
  @IsString()
  password: string;

  @IsString()
  confirmPassword: string;
}
