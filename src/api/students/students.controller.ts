import { Controller, Get, Post, Body, Param, Delete, Patch, } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('Students')
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new student' })
  @ApiBody({ type: CreateStudentDto })
  @ApiResponse({
    status: 200,
    description: 'Student created successfully',
    schema: {
      example: {
        status_code: 200,
        message: 'Student created successfully',
        data: {
          id: 1,
          startDate: '2025-11-27T08:00:00.000Z',
          endDate: '2026-11-27T08:00:00.000Z',
          status: 'ACTIVE',
          user: {
            id: 2,
            FIO: 'Smurodjon Sotiboldiyev',
            email: 'smurodjon983@gmail.com',
            phone: '+998901234567',
            role: 'STUDENT',
          },
        },
      },
    },
  })
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all students' })
  @ApiResponse({
    status: 200,
    description: 'Students retrieved successfully',
    schema: {
      example: {
        status_code: 200,
        data: [
          {
            id: 1,
            startDate: '2025-11-27T08:00:00.000Z',
            endDate: '2026-11-27T08:00:00.000Z',
            status: 'ACTIVE',
            user: {
              id: 2,
              FIO: 'Smurodjon Sotiboldiyev',
              email: 'smurodjon983@gmail.com',
              phone: '+998901234567',
              role: 'STUDENT',
            },
          },
        ],
      },
    },
  })
  findAll() {
    return this.studentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a student by ID' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Student retrieved successfully',
    schema: {
      example: {
        status_code: 200,
        data: {
          id: 1,
          startDate: '2025-11-27T08:00:00.000Z',
          endDate: '2026-11-27T08:00:00.000Z',
          status: 'ACTIVE',
          user: {
            id: 2,
            FIO: 'Smurodjon Sotiboldiyev',
            email: 'smurodjon983@gmail.com',
            phone: '+998901234567',
            role: 'STUDENT',
          },
        },
      },
    },
  })
  findOne(@Param('id') id: number) {
    return this.studentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a student' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiBody({ type: UpdateStudentDto })
  @ApiResponse({
    status: 200,
    description: 'Student updated successfully',
    schema: {
      example: {
        status_code: 200,
        message: 'Student updated successfully',
        data: {
          id: 1,
          startDate: '2025-11-27T08:00:00.000Z',
          endDate: '2026-12-27T08:00:00.000Z',
          status: 'ACTIVE',
          user: {
            id: 2,
            FIO: 'Smurodjon Sotiboldiyev',
            email: 'smurodjon983@gmail.com',
            phone: '+998901234567',
            role: 'STUDENT',
          },
        },
      },
    },
  })
  update(@Param('id') id: number, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentsService.update(id, updateStudentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a student' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Student removed successfully',
    schema: {
      example: {
        status_code: 200,
        message: 'Student removed successfully',
      },
    },
  })
  remove(@Param('id') id: number) {
    return this.studentsService.remove(id);
  }
}
