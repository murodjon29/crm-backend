import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTeacherDto {
  @ApiProperty({
    description: 'User ID associated with the teacher',
    example: 1,
  })
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    description: 'SV file path or URL',
    example: 'uploads/sv/teacher123.pdf',
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  sv: string;
}

export class UpdateTeacherDto {
  @ApiProperty({
    description: 'User ID associated with the teacher (optional)',
    example: 1,
    required: false,
  })
  @IsOptional()
  userId?: number;

  @ApiProperty({
    description: 'SV file path or URL (optional)',
    example: 'uploads/sv/teacher123_updated.pdf',
    required: false,
    type: 'string',
  })
  @IsOptional()
  @IsString()
  sv?: string;
}
