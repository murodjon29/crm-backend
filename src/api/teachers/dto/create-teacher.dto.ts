import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsBoolean, MinLength, IsOptional } from 'class-validator';

export class CreateTeacherDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name of the teacher' })
  @IsString()
  fullName: string;

  @ApiProperty({ example: '+998901234567', description: 'Phone number' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 'AA1234567', description: 'Passport number' })
  @IsString()
  pasport: string;

  @ApiProperty({ example: 'teacher@example.com', description: 'Email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Password123!', description: 'Password for account' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Experienced math teacher', description: 'Short biography' })
  @IsString()
  bio: string;

  @ApiProperty({ example: false, description: 'Verification status', required: false })
  @IsBoolean()
  @IsOptional()
  isVerified?: boolean;

  @ApiProperty({ example: 'uuid-of-avatar', description: 'Teacher avatar ID', required: false })
  @IsOptional()
  @IsString()
  avatarId?: string;
}
