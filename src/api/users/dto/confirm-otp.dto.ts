import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ConfirmOtpDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  otp: string;
}
