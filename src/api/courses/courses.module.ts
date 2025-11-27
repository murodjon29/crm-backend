import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Courses } from 'src/core/entities/course.entity';
import { Group } from 'src/core/entities/group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Courses, Group, ])],
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule {}
