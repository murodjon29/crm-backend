import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsDate } from 'class-validator';

export class CreateBugalteryDto {
  @ApiProperty({ example: 1, description: 'User ID for this Bugaltery record' })
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ example: 500000, description: 'Amount of money' })
  @IsNumber()
  @IsNotEmpty()
  money: number;

  @ApiProperty({ example: '2025-11-27', description: 'Date of the record, default is current date', required: false })
  @IsDate()
  date?: Date;
}
