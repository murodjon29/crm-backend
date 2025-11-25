import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class TeacherloginDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}