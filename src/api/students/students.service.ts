import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/core/entities/user.entity';
import { Repository } from 'typeorm';
import { Student } from 'src/core/entities/student.entity';
import { ROLES } from 'src/common/enum';

@Injectable()
export class StudentsService {

  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Student) private studentsRepository: Repository<Student>,
  ) {}

  async create(createStudentDto: CreateStudentDto) {
    const user = await this.usersRepository.findOne({where: {id: createStudentDto.userId}});
    if(!user){
      throw new NotFoundException(`User with id ${createStudentDto.userId} not found`);
    }
    user.role = ROLES.STUDENT;
    await this.usersRepository.save(user);
    const student = this.studentsRepository.create({
      user: user,
      startDate: createStudentDto.startDate,
      endDate: createStudentDto.endDate,
      status: createStudentDto.status,
    });
    await this.studentsRepository.save(student);
    return {
      status_code: 200,
      message: 'Student created successfully',
      data: student,
    };
  }

  async findAll() {
    const students = await this.studentsRepository.find({ relations: ['user'] });
    return {
      status_code: 200,
      data: students,
    }
  }

  async findOne(id: number) {
    const student = await this.studentsRepository.findOne({ where: { id }, relations: ['user'] });
    if (!student) {
      throw new NotFoundException(`Student with id ${id} not found`);
    }
    return {
      status_code: 200,
      data: student,
    }
  }

  async update(id: number, updateStudentDto: UpdateStudentDto) {
    const student = await this.studentsRepository.findOne({ where: { id }, relations: ['user'] });
    if (!student) {
      throw new NotFoundException(`Student with id ${id} not found`);
    }
    Object.assign(student, updateStudentDto);
    await this.studentsRepository.save(student);
    return {
      status_code: 200,
      message: 'Student updated successfully',
      data: student,
    };
  }

  async remove(id: number) {
    const student = await this.studentsRepository.findOne({ where: { id }, relations: ['user'] });
    if (!student) {
      throw new NotFoundException(`Student with id ${id} not found`);
    } 
    await this.studentsRepository.remove(student);
    return {
      status_code: 200,
      message: 'Student removed successfully',
    };
  }
}
