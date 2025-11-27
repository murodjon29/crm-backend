import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BugalteryService } from './bugaltery.service';
import { CreateBugalteryDto } from './dto/create-bugaltery.dto';
import { UpdateBugalteryDto } from './dto/update-bugaltery.dto';

@Controller('bugaltery')
export class BugalteryController {
  constructor(private readonly bugalteryService: BugalteryService) {}

  @Post()
  create(@Body() createBugalteryDto: CreateBugalteryDto) {
    return this.bugalteryService.create(createBugalteryDto);
  }

  @Get()
  findAll() {
    return this.bugalteryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bugalteryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBugalteryDto: UpdateBugalteryDto) {
    return this.bugalteryService.update(+id, updateBugalteryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bugalteryService.remove(+id);
  }
}
