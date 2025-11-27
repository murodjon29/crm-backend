import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { STUDENT_STATUS } from 'src/common/enum';

export class CreateStudentDto {
  @ApiProperty({ description: 'User ID associated with the student', example: 1 })
  @IsNumber()
  userId: number;

  @ApiProperty({ description: 'Student start date', example: '2025-11-27T08:00:00.000Z' })
  @IsDateString()
  startDate: Date;

  @ApiProperty({ description: 'Student end date', example: '2026-11-27T08:00:00.000Z' })
  @IsDateString()
  endDate: Date;

  @ApiProperty({ description: 'Status of the student', enum: STUDENT_STATUS, example: STUDENT_STATUS.ACTIVE, required: false })
  @IsEnum(STUDENT_STATUS)
  @IsOptional()
  status?: STUDENT_STATUS;
}
