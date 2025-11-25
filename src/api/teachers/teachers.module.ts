import { Module } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { TeachersController } from './teachers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teacher } from 'src/core/entities/teacher.entity';
import { TeacherAvatar } from 'src/core/entities/teacher-avatar.entity';
import { FileModule } from '../file/file.module';
import { MailModule } from 'src/infrastructure/lib/mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([Teacher, TeacherAvatar]), FileModule, MailModule],
  controllers: [TeachersController],
  providers: [TeachersService],
})
export class TeachersModule {}
