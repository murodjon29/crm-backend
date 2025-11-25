import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsNumber } from 'class-validator';
import { Room_STATUS } from 'src/common/enum';

export class CreateRoomDto {
  @ApiProperty({ example: '101', description: 'Room number' })
  @IsString()
  number: string;

  @ApiProperty({ example: 25, description: 'Room width in square meters' })
  @IsNumber()
  width: number;

  @ApiProperty({ enum: Room_STATUS, example: Room_STATUS.AVAILABLE })
  @IsEnum(Room_STATUS)
  status: Room_STATUS;
}
