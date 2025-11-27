import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new course' })
  @ApiBody({
    type: CreateCourseDto,
    examples: {
      example1: {
        value: {
          name: 'JavaScript Basics',
          date: '2025-12-01T10:00:00.000Z',
          price: 150,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Course created successfully',
    schema: {
      example: {
        status_code: 200,
        message: 'Course created successfully',
        data: {
          id: 1,
          name: 'JavaScript Basics',
          date: '2025-12-01T10:00:00.000Z',
          price: 150,
          createdAt: '2025-11-27T09:00:00.000Z',
          updatedAt: '2025-11-27T09:00:00.000Z',
        },
      },
    },
  })
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all courses' })
  @ApiResponse({
    status: 200,
    description: 'Courses retrieved successfully',
    schema: {
      example: {
        status_code: 200,
        data: [
          {
            id: 1,
            name: 'JavaScript Basics',
            date: '2025-12-01T10:00:00.000Z',
            price: 150,
            createdAt: '2025-11-27T09:00:00.000Z',
            updatedAt: '2025-11-27T09:00:00.000Z',
          },
          {
            id: 2,
            name: 'Python Advanced',
            date: '2025-12-05T10:00:00.000Z',
            price: 200,
            createdAt: '2025-11-27T09:10:00.000Z',
            updatedAt: '2025-11-27T09:10:00.000Z',
          },
        ],
      },
    },
  })
  findAll() {
    return this.coursesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get course by id' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Course retrieved successfully',
    schema: {
      example: {
        status_code: 200,
        data: {
          id: 1,
          name: 'JavaScript Basics',
          date: '2025-12-01T10:00:00.000Z',
          price: 150,
          createdAt: '2025-11-27T09:00:00.000Z',
          updatedAt: '2025-11-27T09:00:00.000Z',
        },
      },
    },
  })
  findOne(@Param('id') id: number) {
    return this.coursesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update course by id' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiBody({
    type: UpdateCourseDto,
    examples: {
      example1: {
        value: {
          name: 'JavaScript Advanced',
          date: '2025-12-10T10:00:00.000Z',
          price: 180,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Course updated successfully',
    schema: {
      example: {
        status_code: 200,
        message: 'Course updated successfully',
        data: {
          id: 1,
          name: 'JavaScript Advanced',
          date: '2025-12-10T10:00:00.000Z',
          price: 180,
          createdAt: '2025-11-27T09:00:00.000Z',
          updatedAt: '2025-11-27T10:00:00.000Z',
        },
      },
    },
  })
  update(@Param('id') id: number, @Body() updateCourseDto: UpdateCourseDto) {
    return this.coursesService.update(id, updateCourseDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete course by id' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Course removed successfully',
    schema: {
      example: {
        status_code: 200,
        message: 'Course removed successfully',
      },
    },
  })
  remove(@Param('id') id: number) {
    return this.coursesService.remove(id);
  }
}
