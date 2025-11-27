import { Module } from '@nestjs/common';
import { BugalteryService } from './bugaltery.service';
import { BugalteryController } from './bugaltery.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bugaltery } from 'src/core/entities/bugaltery.entity';
import { User } from 'src/core/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bugaltery, User])],
  controllers: [BugalteryController],
  providers: [BugalteryService],
})
export class BugalteryModule {}
