import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Teacher } from 'src/core/entities/teacher.entity';
import { User } from 'src/core/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { ROLES } from 'src/common/enum';
import { FileService } from '../file/file.service';
@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(Teacher) private teachersRepository: Repository<Teacher>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly fileService: FileService,
  ) {}

  async createTeacher(
    createdTeacherDto: CreateTeacherDto,
    sv: Express.Multer.File,
  ) {
    const user = await this.userRepository.findOne({
      where: { id: Number(createdTeacherDto.userId) },
    });
    if (!user) {
      throw new NotFoundException(
        `User with id ${createdTeacherDto.userId} not found`,
      );
    }
    user.role = ROLES.TEACHER;
    await this.userRepository.save(user);
    const teacher = this.teachersRepository.create({
      user: user,
    });
    if (sv) {
      const svFile = await this.fileService.createFile(sv);
      teacher.sv = svFile;
    }
    await this.teachersRepository.save(teacher);
    return {
      status_code: 200,
      message: 'Teacher created successfully',
    };
  }

  async findAll() {
    const teachers = await this.teachersRepository.find({
      relations: ['user'],
    });
    return {
      status_code: 200,
      data: teachers,
    };
  }

  async findOne(id: number) {
    const teacher = await this.teachersRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!teacher) {
      throw new NotFoundException(`Teacher with id ${id} not found`);
    }
    return {
      status_code: 200,
      data: teacher,
    };
  }

  async update(id: number, updateTeacherDto: CreateTeacherDto, sv?: Express.Multer.File) {
    const teacher = await this.teachersRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!teacher) {
      throw new NotFoundException(`Teacher with id ${id} not found`);
    }
    if (sv) {
      if (await this.fileService.existFile(teacher.sv)) {
        await this.fileService.deleteFile(teacher.sv);
      }
      const svFile = await this.fileService.createFile(sv);
      teacher.sv = svFile;
    }
    const user = await this.userRepository.findOne({
      where: { id: Number(updateTeacherDto.userId) },
    });
    if (!user) {
      throw new NotFoundException(
        `User with id ${updateTeacherDto.userId} not found`,
      );
    }
    teacher.user = user;
    await this.teachersRepository.save(teacher);
    return {
      status_code: 200,
      message: 'Teacher updated successfully',
      data: teacher,
    };
  }

  async remove(id: number) {
    const teacher = await this.teachersRepository.findOne({ where: { id } });
    if (!teacher) {
      throw new NotFoundException(`Teacher with id ${id} not found`);
    }
    if (await this.fileService.existFile(teacher.sv)) {
      await this.fileService.deleteFile(teacher.sv);
    }
    await this.teachersRepository.remove(teacher);
    return {
      status_code: 200,
      message: 'Teacher removed successfully',
    };
  }
}
