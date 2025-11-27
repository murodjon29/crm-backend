// src/modules/groups/dto/create-group.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString, IsNumber } from 'class-validator';

export class CreateGroupDto {
  @ApiProperty({ example: 'Group A', description: 'Name of the group' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '2025-12-01T10:00:00.000Z', description: 'Start time of the group' })
  @IsDateString()
  start_time: Date;

  @ApiProperty({ example: '2025-12-01T12:00:00.000Z', description: 'End time of the group' })
  @IsDateString()
  end_time: Date;

  @ApiProperty({ example: '2025-12-01', description: 'Start date of the group' })
  @IsDateString()
  start_date: Date;

  @ApiProperty({ example: '2025-12-31', description: 'End date of the group' })
  @IsDateString()
  end_date: Date;

  @ApiProperty({ example: 1, description: 'ID of the teacher assigned to the group' })
  @IsNumber()
  teacherId: number;

  @ApiProperty({ example: 1, description: 'ID of the room assigned to the group' })
  @IsNumber()
  roomId: number;

  @ApiProperty({ example: 1, description: 'ID of the course assigned to the group' })
  @IsNumber()
  courseId: number;
}
