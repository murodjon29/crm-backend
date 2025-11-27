import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from 'src/core/entities/group.entity';
import { Repository } from 'typeorm';
import { Room } from 'src/core/entities/room.entity';
import { Courses } from 'src/core/entities/course.entity';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group) private groupsRepository: Repository<Group>,
    @InjectRepository(Room) private roomsRepository: Repository<Room>,
    @InjectRepository(Courses) private coursesRepository: Repository<Courses>,
  ) {}

  async create(createGroupDto: CreateGroupDto) {
    const room = await this.roomsRepository.findOne({
      where: { id: Number(createGroupDto.roomId) },
    });
    if (!room)
      throw new NotFoundException(
        `Room with id ${createGroupDto.roomId} not found`,
      );
    const course = await this.coursesRepository.findOne({
      where: { id: Number(createGroupDto.courseId) },
    });
    if (!course)
      throw new NotFoundException(
        `Course with id ${createGroupDto.courseId} not found`,
      );
    const group = this.groupsRepository.create({
      ...createGroupDto,
      room,
      course,
    });
    await this.groupsRepository.save(group);
    return {
      status_code: 200,
      message: 'Group created successfully',
      data: group,
    };
  }

  async findAll() {
    const groups = await this.groupsRepository.find({ relations: ['room', 'course'] });
    return {
      status_code: 200,
      data: groups,
    };
  }

  async findOne(id: number) {
    const group = await this.groupsRepository.findOne({ where: { id }, relations: ['room', 'course'] });
    if (!group) {
      throw new NotFoundException(`Group with id ${id} not found`);
    }
    return {
      status_code: 200,
      data: group,
    };  
  }

  async update(id: number, updateGroupDto: UpdateGroupDto) {
    const room = await this.roomsRepository.findOne({
      where: { id: Number(updateGroupDto.roomId) },
    })
    if (!room)
      throw new NotFoundException(
        `Room with id ${updateGroupDto.roomId} not found`,
      );
    const course = await this.coursesRepository.findOne({
      where: { id: Number(updateGroupDto.courseId) },
    });
    if (!course)
      throw new NotFoundException(
        `Course with id ${updateGroupDto.courseId} not found`,
      );
    const group = await this.groupsRepository.findOne({ where: { id } });
    if (!group) {
      throw new NotFoundException(`Group with id ${id} not found`);
    }
    Object.assign(group, updateGroupDto);
    await this.groupsRepository.save(group);
    return {
      status_code: 200,
      message: 'Group updated successfully',
      data: group,
    };
  }

  async remove(id: number) {
    const group = await this.groupsRepository.findOne({ where: { id } });
    if (!group) {
      throw new NotFoundException(`Group with id ${id} not found`);
    }
    await this.groupsRepository.remove(group);
    return {
      status_code: 200,
      message: 'Group removed successfully',
    };
  }
}
