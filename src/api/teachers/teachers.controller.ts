import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  Res,
} from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody, ApiParam } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Teachers')
@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Post()
  @UseInterceptors(FileInterceptor('sv'))
  @ApiOperation({ summary: 'Create a new teacher' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'number', example: 1 },
        sv: { type: 'string', format: 'binary' },
      },
      required: ['userId'],
    },
  })
  @ApiResponse({ status: 200, description: 'Teacher created successfully' })
  create(@Body() createTeacherDto: CreateTeacherDto, @UploadedFile() sv: Express.Multer.File) {
    return this.teachersService.createTeacher(createTeacherDto, sv);
  }

  @Get()
  @ApiOperation({ summary: 'Get all teachers' })
  @ApiResponse({ status: 200, description: 'Teachers retrieved successfully' })
  findAll() {
    return this.teachersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get teacher by ID' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Teacher retrieved successfully' })
  findOne(@Param('id') id: number) {
    return this.teachersService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('sv'))
  @ApiOperation({ summary: 'Update teacher info' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'number', example: 1 },
        sv: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Teacher updated successfully' })
  update(
    @Param('id') id: number,
    @Body() updateTeacherDto: CreateTeacherDto,
    @UploadedFile() sv?: Express.Multer.File,
  ) {
    return this.teachersService.update(id, updateTeacherDto, sv);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a teacher' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Teacher removed successfully' })
  remove(@Param('id') id: number) {
    return this.teachersService.remove(id);
  }
}
