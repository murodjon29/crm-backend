import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from 'src/core/entities/group.entity';
import { Room } from 'src/core/entities/room.entity';
import { Courses } from 'src/core/entities/course.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Group, Room, Courses])],
  controllers: [GroupsController],
  providers: [GroupsService],
})
export class GroupsModule {}
