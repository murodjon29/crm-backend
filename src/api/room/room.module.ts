import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from 'src/core/entities/room.entity';
import { Group } from 'src/core/entities/group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Room, Group])],
  controllers: [RoomController],
  providers: [RoomService],
})
export class RoomModule {}
