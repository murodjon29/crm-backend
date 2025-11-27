// src/modules/groups/groups.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Groups')
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new group' })
  @ApiBody({
    type: CreateGroupDto,
    examples: {
      example1: {
        value: {
          name: 'Group A',
          start_time: '2025-12-01T10:00:00.000Z',
          end_time: '2025-12-01T12:00:00.000Z',
          start_date: '2025-12-01',
          end_date: '2025-12-31',
          teacherId: 1,
          roomId: 1,
          courseId: 1,
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Group created successfully' })
  create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupsService.create(createGroupDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all groups' })
  @ApiResponse({ status: 200, description: 'Groups retrieved successfully' })
  findAll() {
    return this.groupsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get group by id' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Group retrieved successfully' })
  findOne(@Param('id') id: number) {
    return this.groupsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update group info' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiBody({
    type: UpdateGroupDto,
    examples: {
      example1: {
        value: {
          name: 'Group B',
          start_time: '2025-12-05T14:00:00.000Z',
          end_time: '2025-12-05T16:00:00.000Z',
          start_date: '2025-12-05',
          end_date: '2025-12-20',
          teacherId: 2,
          roomId: 2,
          courseId: 2,
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Group updated successfully' })
  update(@Param('id') id: number, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupsService.update(id, updateGroupDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete group' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Group removed successfully' })
  remove(@Param('id') id: number) {
    return this.groupsService.remove(id);
  }
}
