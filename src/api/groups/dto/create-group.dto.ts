import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsUUID } from 'class-validator';

export class CreateGroupDto {
  @ApiProperty({ example: 'Math Group', description: 'Name of the group' })
  @IsString()
  name: string;

  @ApiProperty({ example: '2025-12-01', description: 'Start date' })
  @IsDateString()
  start_date: Date;

  @ApiProperty({ example: '2025-12-10', description: 'End date' })
  @IsDateString()
  end_date: Date;

  @ApiProperty({ example: '2025-12-01T08:00:00', description: 'Start time' })
  @IsDateString()
  start_time: Date;

  @ApiProperty({ example: '2025-12-01T12:00:00', description: 'End time' })
  @IsDateString()
  end_time: Date;

  @ApiProperty({ example: 'uuid-of-room', description: 'Room ID to link group' })
  @IsUUID()
  roomId: string;
}
