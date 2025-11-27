import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Courses } from 'src/core/entities/course.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CoursesService {

  constructor(
    @InjectRepository(Courses) private coursesRepository: Repository<Courses>,

  ) {}

  async create(createCourseDto: CreateCourseDto) {
    const course = this.coursesRepository.create(createCourseDto);
    await this.coursesRepository.save(course);
    return {
      status_code: 200,
      message: 'Course created successfully',
      data: course,
    };
  }

  async findAll() {
    const courses = await this.coursesRepository.find();
    return {
      status_code: 200,
      data: courses,
    };
  }

  async findOne(id: number) {
    const course = await this.coursesRepository.findOne({ where: { id } });
    if (!course) {
      throw new NotFoundException(`Course with id ${id} not found`);
    }
    return {
      status_code: 200,
      data: course,
    };
  }

  async update(id: number, updateCourseDto: UpdateCourseDto) {
    const course = await this.coursesRepository.findOne({ where: { id } });
    if (!course) {
      throw new NotFoundException(`Course with id ${id} not found`);
    }
    Object.assign(course, updateCourseDto);
    await this.coursesRepository.save(course);
    return {
      status_code: 200,
      message: 'Course updated successfully',
      data: course,
    };
  }

  async remove(id: number) {
    const course = await this.coursesRepository.findOne({ where: { id } });
    if (!course) {
      throw new NotFoundException(`Course with id ${id} not found`);
    }
    await this.coursesRepository.remove(course);
    return {
      status_code: 200,
      message: 'Course removed successfully',
    };
  }
}
