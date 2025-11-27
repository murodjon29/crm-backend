import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UploadedFile,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResendOtpDto } from './dto/resendOtp.dto';
import { ConfirmOtpDto } from './dto/confirm-otp.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiOperation({ summary: 'Register a new user' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        FIO: { type: 'string', example: 'Smurodjon Sotiboldiyev' },
        email: { type: 'string', example: 'smurodjon983@gmail.com' },
        password: { type: 'string', example: 'StrongPassword123!' },
        phone: { type: 'string', example: '+998901234567' },
        avatar: { type: 'string', format: 'binary' },
      },
      required: ['FIO', 'email', 'password'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    content: {
      'application/json': {
        example: {
          status_code: 201,
          message: 'User registered successfully',
          user: {
            id: 1,
            FIO: 'Smurodjon Sotiboldiyev',
            email: 'smurodjon983@gmail.com',
            phone: '+998901234567',
            avatar: 'avatar123.jpg',
            isVerified: false,
            isActive: false,
            role: 'USER',
            createdAt: '2025-11-27T08:00:00.000Z',
          },
        },
      },
    },
  })
  register(@Body() createUserDto: CreateUserDto, @UploadedFile() file: Express.Multer.File) {
    return this.usersService.register(createUserDto, file);
  }

  @Post('confirm-otp')
  @ApiOperation({ summary: 'Confirm OTP and verify email' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'smurodjon983@gmail.com' },
        otp: { type: 'string', example: '123456' },
      },
      required: ['email', 'otp'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Email verified successfully',
    content: {
      'application/json': {
        example: {
          status_code: 200,
          message: 'Email verified successfully',
          access_token: 'jwt_access_token_here',
          refresh_token: 'jwt_refresh_token_here',
        },
      },
    },
  })
  confirmOtp(@Body() confirmOtpDto: ConfirmOtpDto, @Res() res: Response) {
    return this.usersService.confirmOtp(confirmOtpDto, res);
  }

  @Post('resend-otp')
  @ApiOperation({ summary: 'Resend OTP to email' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'smurodjon983@gmail.com' },
      },
      required: ['email'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'OTP resent successfully',
    content: {
      'application/json': {
        example: {
          status_code: 200,
          message: 'OTP resent successfully',
        },
      },
    },
  })
  resendOtp(@Body() resendOtpDto: ResendOtpDto) {
    return this.usersService.resendOtp(resendOtpDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'smurodjon983@gmail.com' },
        password: { type: 'string', example: 'StrongPassword123!' },
      },
      required: ['email', 'password'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    content: {
      'application/json': {
        example: {
          status_code: 200,
          message: 'Login successful',
          access_token: 'jwt_access_token_here',
          refresh_token: 'jwt_refresh_token_here',
          user: {
            id: 1,
            FIO: 'Smurodjon Sotiboldiyev',
            email: 'smurodjon983@gmail.com',
            phone: '+998901234567',
            avatar: 'avatar123.jpg',
            isVerified: true,
            isActive: true,
            role: 'USER',
            createdAt: '2025-11-27T08:00:00.000Z',
          },
        },
      },
    },
  })
  login(@Body() loginDto: LoginDto, @Res() res: Response) {
    return this.usersService.login(loginDto, res);
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiQuery({ name: 'userId', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    content: {
      'application/json': {
        example: {
          status_code: 200,
          message: 'Token refreshed successfully',
          access_token: 'jwt_access_token_here',
          refresh_token: 'jwt_refresh_token_here',
        },
      },
    },
  })
  refreshToken(@Query('userId') userId: number, @Res() res: Response) {
    return this.usersService.refreshToken(userId, res);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Send OTP to email for password reset' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'smurodjon983@gmail.com' },
      },
      required: ['email'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'OTP sent successfully',
    content: {
      'application/json': {
        example: {
          status_code: 200,
          message: 'OTP sent successfully',
        },
      },
    },
  })
  forgotPassword(@Body() resendOtpDto: ResendOtpDto) {
    return this.usersService.forgotPassword(resendOtpDto);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password with OTP' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'smurodjon983@gmail.com' },
        otp: { type: 'string', example: '123456' },
        password: { type: 'string', example: 'NewStrongPassword123!' },
      },
      required: ['email', 'otp', 'password'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Password reset successful',
    content: {
      'application/json': {
        example: {
          status_code: 200,
          message: 'Password reset successful',
        },
      },
    },
  })
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.usersService.resetPassword(resetPasswordDto);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout user' })
  @ApiQuery({ name: 'refresh_token', example: 'jwt_refresh_token_here' })
  @ApiResponse({
    status: 200,
    description: 'Logout successful',
    content: {
      'application/json': {
        example: {
          status_code: 200,
          message: 'Logout successful',
        },
      },
    },
  })
  logout(@Query('refresh_token') refresh_token: string, @Res() res: Response) {
    return this.usersService.logout(refresh_token, res);
  }

  @Post('create-manager')
  @ApiOperation({ summary: 'Assign manager role to a user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'smurodjon983@gmail.com' },
      },
      required: ['email'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Manager role assigned successfully',
    content: {
      'application/json': {
        example: {
          status_code: 201,
          message: 'Manager role assigned successfully',
          manager: {
            id: 1,
            email: 'smurodjon983@gmail.com',
            role: 'MANAGER',
          },
        },
      },
    },
  })
  createManager(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createManager(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
    content: {
      'application/json': {
        example: {
          status_code: 200,
          message: 'Users retrieved successfully',
          users: [
            {
              id: 1,
              FIO: 'Smurodjon Sotiboldiyev',
              email: 'smurodjon983@gmail.com',
              phone: '+998901234567',
              avatar: 'avatar123.jpg',
              isVerified: true,
              isActive: true,
              role: 'USER',
            },
          ],
        },
      },
    },
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully',
    content: {
      'application/json': {
        example: {
          status_code: 200,
          message: 'User retrieved successfully',
          user: {
            id: 1,
            FIO: 'Smurodjon Sotiboldiyev',
            email: 'smurodjon983@gmail.com',
            phone: '+998901234567',
            avatar: 'avatar123.jpg',
            isVerified: true,
            isActive: true,
            role: 'USER',
          },
        },
      },
    },
  })
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiOperation({ summary: 'Update user info' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        FIO: { type: 'string', example: 'Smurodjon Sotiboldiyev' },
        email: { type: 'string', example: 'smurodjon983@gmail.com' },
        phone: { type: 'string', example: '+998901234567' },
        password: { type: 'string', example: 'NewStrongPassword123!' },
        avatar: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    content: {
      'application/json': {
        example: {
          status_code: 200,
          message: 'User updated successfully',
          user: {
            id: 1,
            FIO: 'Smurodjon Sotiboldiyev',
            email: 'smurodjon983@gmail.com',
            phone: '+998901234567',
            avatar: 'avatar123_new.jpg',
            isVerified: true,
            isActive: true,
            role: 'USER',
          },
        },
      },
    },
  })
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto, @UploadedFile() file?: Express.Multer.File) {
    return this.usersService.update(id, updateUserDto, file);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
    content: {
      'application/json': {
        example: {
          status_code: 200,
          message: 'User deleted successfully',
        },
      },
    },
  })
  remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
}
