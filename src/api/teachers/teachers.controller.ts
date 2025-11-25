import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  Res,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';

import { TeachersService } from './teachers.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { ConfirmOtpDto } from './dto/confirm-otp.dto';
import { TeacherloginDto } from './dto/teacher-login.dto';
import { JwtGuard } from 'src/common/guard/jwt-auth.guard';
import { SelfGuard } from 'src/common/guard/self.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { ROLES } from 'src/common/enum';
import { Roles } from 'src/common/decorator/roles.decorator';

@ApiTags('Teachers')
@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  // ===================== REGISTER =====================
  @Post('register')
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiOperation({ summary: 'Register a new teacher' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        fullName: { type: 'string', example: 'John Doe' },
        phone: { type: 'string', example: '+998901234567' },
        pasport: { type: 'string', example: 'AA1234567' },
        email: { type: 'string', example: 'teacher@gmail.com' },
        password: { type: 'string', example: 'Password123!' },
        bio: { type: 'string', example: 'Experienced math teacher' },
        avatar: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Teacher registered successfully',
    schema: {
      example: {
        status_code: 201,
        message: 'Teacher registered successfully',
        teacher: {
          id: 1,
          fullName: 'John Doe',
          phone: '+998901234567',
          pasport: 'AA1234567',
          email: 'teacher@gmail.com',
          bio: 'Experienced math teacher',
          isVerified: false,
          avatar: { id: 1, image_url: 'avatar_url_here' },
        },
      },
    },
  })
  async register(
    @Body() createTeacherDto: CreateTeacherDto,
    @UploadedFile() avatar?: Express.Multer.File,
  ) {
    return this.teachersService.register(createTeacherDto, avatar);
  }

  // ===================== CONFIRM OTP =====================
  @Post('confirm-otp')
  @ApiOperation({ summary: 'Confirm OTP sent to email' })
  @ApiBody({ type: ConfirmOtpDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'OTP confirmed successfully',
    schema: {
      example: {
        status_code: 200,
        message: 'OTP confirmed successfully',
        access_token: 'jwt_access_token_here',
      },
    },
  })
  async confirmOtp(@Body() confirmOtpDto: ConfirmOtpDto, @Res() res: Response) {
    await this.teachersService.confirmOtp(confirmOtpDto, res);
  }

  // ===================== LOGIN =====================
  @Post('login')
  @ApiOperation({ summary: 'Teacher login' })
  @ApiBody({ type: TeacherloginDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login successful',
    schema: {
      example: {
        status_code: 200,
        message: 'Login successful',
        access_token: 'jwt_access_token_here',
      },
    },
  })
  async login(@Body() teacherloginDto: TeacherloginDto, @Res() res: Response) {
    await this.teachersService.login(teacherloginDto, res);
  }

  // ===================== PROFILE =====================
  @Post('me')
  @UseGuards(JwtGuard, SelfGuard)
  @ApiOperation({ summary: 'Get current teacher profile' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Current teacher profile retrieved successfully',
    schema: {
      example: {
        status_code: 200,
        message: 'Current teacher profile retrieved successfully',
        teacher: {
          id: 1,
          fullName: 'John Doe',
          phone: '+998901234567',
          pasport: 'AA1234567',
          email: 'teacher@gmail.com',
          bio: 'Experienced math teacher',
          isVerified: true,
          avatar: { id: 1, image_url: 'avatar_url_here' },
        },
      },
    },
  })
  async getProfile(@Body('teacherId') teacherId: number) {
    return this.teachersService.me(teacherId);
  }

  // ===================== FORGOT PASSWORD =====================
  @Post('forgot-password')
  @ApiOperation({ summary: 'Send OTP to reset password' })
  @ApiBody({ schema: { type: 'object', properties: { email: { type: 'string', example: 'teacher@gmail.com' } } } })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'OTP sent successfully',
    schema: { example: { status_code: 200, message: 'OTP sent successfully' } },
  })
  async forgotPassword(@Body('email') email: string) {
    return this.teachersService.forgotPassword(email);
  }

  // ===================== RESET PASSWORD =====================
  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password using OTP' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        confirmOtpDto: {
          type: 'object',
          properties: { email: { type: 'string' }, otp: { type: 'string' } },
        },
        newPassword: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Password reset successful',
    schema: {
      example: {
        status_code: 200,
        message: 'Password reset successful',
        access_token: 'jwt_access_token_here',
      },
    },
  })
  async resetPassword(
    @Body() body: { confirmOtpDto: ConfirmOtpDto; newPassword: string },
    @Res() res: Response,
  ) {
    await this.teachersService.resetPassword(body.confirmOtpDto, body.newPassword, res);
  }

  // ===================== CRUD ENDPOINTS =====================
  @Get()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(ROLES.ADMIN)
  @ApiOperation({ summary: 'Get all teachers' })
  async findAll() {
    return this.teachersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtGuard, SelfGuard)
  @ApiOperation({ summary: 'Get teacher by ID' })
  async findOne(@Param('id') id: number) {
    return this.teachersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtGuard, SelfGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiOperation({ summary: 'Update teacher' })
  async update(
    @Param('id') id: number,
    @Body() updateTeacherDto: UpdateTeacherDto,
    @UploadedFile() avatar?: Express.Multer.File,
  ) {
    return this.teachersService.update(id, updateTeacherDto, avatar);
  }

  @Delete(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(ROLES.ADMIN)
  @ApiOperation({ summary: 'Delete teacher' })
  async remove(@Param('id') id: number) {
    return this.teachersService.remove(id);
  }
}
