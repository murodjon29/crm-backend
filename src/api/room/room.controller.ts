import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Rooms')
@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new room' })
  @ApiBody({
    type: CreateRoomDto,
    examples: {
      example1: {
        value: {
          name: 'Room A',
          description: 'First floor, Building 1',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Room created successfully',
    schema: {
      example: {
        status_code: 200,
        message: 'Room created successfully',
        data: {
          id: 1,
          name: 'Room A',
          description: 'First floor, Building 1',
          createdAt: '2025-11-27T10:00:00.000Z',
          updatedAt: '2025-11-27T10:00:00.000Z',
        },
      },
    },
  })
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomService.create(createRoomDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all rooms' })
  @ApiResponse({
    status: 200,
    description: 'Rooms retrieved successfully',
    schema: {
      example: {
        status_code: 200,
        data: [
          {
            id: 1,
            name: 'Room A',
            description: 'First floor, Building 1',
            groups: [],
            createdAt: '2025-11-27T10:00:00.000Z',
            updatedAt: '2025-11-27T10:00:00.000Z',
          },
        ],
      },
    },
  })
  findAll() {
    return this.roomService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get room by ID' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Room retrieved successfully',
    schema: {
      example: {
        status_code: 200,
        data: {
          id: 1,
          name: 'Room A',
          description: 'First floor, Building 1',
          groups: [],
          createdAt: '2025-11-27T10:00:00.000Z',
          updatedAt: '2025-11-27T10:00:00.000Z',
        },
      },
    },
  })
  findOne(@Param('id') id: number) {
    return this.roomService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a room' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiBody({
    type: UpdateRoomDto,
    examples: {
      example1: {
        value: {
          name: 'Room B',
          description: 'Second floor, Building 2',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Room updated successfully',
    schema: {
      example: {
        status_code: 200,
        message: 'Room updated successfully',
        data: {
          id: 1,
          name: 'Room B',
          description: 'Second floor, Building 2',
          createdAt: '2025-11-27T10:00:00.000Z',
          updatedAt: '2025-11-27T12:00:00.000Z',
        },
      },
    },
  })
  update(@Param('id') id: number, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomService.update(id, updateRoomDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a room' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Room removed successfully',
    schema: {
      example: {
        status_code: 200,
        message: 'Room removed successfully',
      },
    },
  })
  remove(@Param('id') id: number) {
    return this.roomService.remove(id);
  }
}
