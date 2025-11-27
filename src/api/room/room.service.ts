import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from 'src/core/entities/room.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room) private roomsRepository: Repository<Room>,
  ) {}

  async create(createRoomDto: CreateRoomDto) {
    const room = this.roomsRepository.create({ ...createRoomDto });
    await this.roomsRepository.save(room);
    return {
      status_code: 200,
      message: 'Room created successfully',
      data: room,
    };
  }

  async findAll() {
    const rooms = await this.roomsRepository.find({relations: ['groups']});
    return {
      status_code: 200,
      data: rooms,
    };
  }

  async findOne(id: number) {
    const room = await this.roomsRepository.findOne({ where: { id }, relations: ['groups'] });
    if(!room){
      throw new NotFoundException(`Room with id ${id} not found`);
    }
    return {
      status_code: 200,
      data: room,
    };
  }

  async update(id: number, updateRoomDto: UpdateRoomDto) {
    const room = await this.roomsRepository.findOne({ where: { id } });
    if(!room){
      throw new NotFoundException(`Room with id ${id} not found`);
    }
    Object.assign(room, updateRoomDto);
    await this.roomsRepository.save(room);
    return {
      status_code: 200,
      message: 'Room updated successfully',
      data: room,
    };

  }

  async remove(id: number) {
    const room = await this.roomsRepository.findOne({ where: { id } });
    if(!room){
      throw new NotFoundException(`Room with id ${id} not found`);
    }
    await this.roomsRepository.remove(room);
    return {
      status_code: 200,
      message: 'Room removed successfully',
    };
  }
}
