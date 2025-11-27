import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBugalteryDto } from './dto/create-bugaltery.dto';
import { UpdateBugalteryDto } from './dto/update-bugaltery.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Bugaltery } from 'src/core/entities/bugaltery.entity';
import { Repository } from 'typeorm';
import { User } from 'src/core/entities/user.entity';

@Injectable()
export class BugalteryService {

  constructor(
    @InjectRepository(Bugaltery) private readonly bugalteryRepository: Repository<Bugaltery>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createBugalteryDto: CreateBugalteryDto) {
    const user = await this.bugalteryRepository.findOne({where: {id: Number(createBugalteryDto.userId)}});
    const bugaltery = this.bugalteryRepository.create({ ...createBugalteryDto });
    await this.bugalteryRepository.save(bugaltery);
    return {
      status_code: 200,
      message: 'Bugaltery created successfully',
      data: bugaltery,
    };
  }

  async findAll() {
    const bugalteries = await this.bugalteryRepository.find();
    return {
      status_code: 200,
      data: bugalteries,
    };
  }

  async findOne(id: number) {
    const bugaltery = await this.bugalteryRepository.findOne({ where: { id }, relations: ['user'] });
    if (!bugaltery) {
      throw new NotFoundException(`Bugaltery with id ${id} not found`);
    }
    return {
      status_code: 200,
      data: bugaltery,
    };
  }

  async update(id: number, updateBugalteryDto: UpdateBugalteryDto) {
    const teacher = await this.userRepository.findOne({where: {id: Number(updateBugalteryDto.userId)}});
    if (!teacher) {
      throw new NotFoundException(`User with id ${updateBugalteryDto.userId} not found`);
    }
    const bugaltery = await this.bugalteryRepository.findOne({ where: { id } });
    if (!bugaltery) {
      throw new NotFoundException(`Bugaltery with id ${id} not found`);
    }
    Object.assign(bugaltery, updateBugalteryDto);
    await this.bugalteryRepository.save(bugaltery);
    return {
      status_code: 200,
      message: 'Bugaltery updated successfully',
      data: bugaltery,
    };
  }

  async remove(id: number) {
    const bugaltery = await this.bugalteryRepository.findOne({ where: { id } });
    if (!bugaltery) {
      throw new NotFoundException(`Bugaltery with id ${id} not found`);
    }
    await this.bugalteryRepository.remove(bugaltery);
    return {
      status_code: 200,
      message: 'Bugaltery removed successfully',
    };
  }
}
