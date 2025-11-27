import { Module } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { TeachersController } from './teachers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teacher } from 'src/core/entities/teacher.entity';
import { FileModule } from '../file/file.module';
import { User } from 'src/core/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Teacher, User]), FileModule],
  controllers: [TeachersController],
  providers: [TeachersService],
})
export class TeachersModule {}
