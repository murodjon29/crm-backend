import { PartialType } from '@nestjs/swagger';
import { CreateBugalteryDto } from './create-bugaltery.dto';

export class UpdateBugalteryDto extends PartialType(CreateBugalteryDto) {}
