import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/core/entities/user.entity';
import { FileModule } from '../file/file.module';
import { MailModule } from 'src/infrastructure/lib/mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), FileModule, MailModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
