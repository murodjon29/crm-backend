import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsDateString } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({ example: 'Web Development Bootcamp', description: 'Course name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '2025-12-01T08:00:00.000Z', description: 'Course start date' })
  @IsDateString()
  startDate: Date;

  @ApiProperty({ example: 150000, description: 'Course price in UZS' })
  @IsNumber()
  @IsNotEmpty()
  price: number;
}
