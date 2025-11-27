import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/core/entities/user.entity';
import { MailService } from 'src/infrastructure/lib/mail/mail.service';
import { FileService } from '../file/file.service';
import { JwtService } from '@nestjs/jwt';
import { BcryptEncryption } from 'src/infrastructure/lib/bcrypt';
import { generateOTP } from 'src/infrastructure/lib/otp-generator/generateOTP';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Response } from 'express';
import { ResendOtpDto } from './dto/resendOtp.dto';
import { ConfirmOtpDto } from './dto/confirm-otp.dto';
import { LoginDto } from './dto/login.dto';
import { ROLES } from 'src/common/enum';
import { ResetPasswordDto } from './dto/resetPassword.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly mailService: MailService,
    private readonly fileService: FileService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto, file?: Express.Multer.File) {
    const { email, phone } = createUserDto;
    if (await this.usersRepository.findOneBy({ email })) {
      throw new ConflictException(`User with email ${email} already exists`);
    }
    if (phone && (await this.usersRepository.findOneBy({ phone }))) {
      throw new ConflictException(`User with phone ${phone} already exists`);
    }

    if (file) {
      const savedAvatar = await this.fileService.createFile(file);
      createUserDto.avatar = savedAvatar;
    }
    createUserDto.password = await BcryptEncryption.encrypt(
      createUserDto.password,
    );
    const user = this.usersRepository.create(createUserDto);
    await this.usersRepository.save(user);
    const otp = generateOTP();
    await this.mailService.sendOTP(user.email, String(otp));
    await this.cacheManager.set(email, otp, 60 * 5 * 1000); // OTP valid for 5 minutes
    return {
      status_code: 201,
      message: 'User registered successfully',
      user,
    };
  }

  async confirmOtp({ email, otp }: ConfirmOtpDto, res: Response) {
    const cachedOtp = await this.cacheManager.get(email);
    if (!cachedOtp || String(cachedOtp) !== String(otp)) {
      throw new BadRequestException(`Invalid or expired OTP`);
    }
    const user = await this.usersRepository.findOne({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    user.isVerified = true;
    user.isActive = true;
    await this.usersRepository.save(user);
    await this.cacheManager.del(email);
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    const access_token = this.jwtService.sign(payload, { expiresIn: '1d' });
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '30d' });
    await this.writeCookie(res, refresh_token);
    return res.json({
      status_code: 200,
      message: 'Email verified successfully',
      access_token,
      refresh_token,
    });
  }

  async resendOtp({ email }: ResendOtpDto) {
    const user = await this.usersRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    const otp = generateOTP();
    await this.mailService.sendOTP(email, String(otp));
    await this.cacheManager.set(email, otp, 60 * 5 * 1000);
    return {
      status_code: 200,
      message: 'OTP resent successfully',
    };
  }

  async login(loginDto: LoginDto, res: Response) {
    const { email, password } = loginDto;

    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user)
      throw new NotFoundException(`User with email ${email} not found`);
    if (!user.isVerified) throw new BadRequestException(`Email not verified`);

    const isPasswordValid = await BcryptEncryption.compare(
      password,
      user.password,
    );
    if (!isPasswordValid) throw new BadRequestException(`Invalid password`);

    user.isActive = true;
    await this.usersRepository.save(user);

    const payload = { id: user.id, email: user.email, role: user.role };
    const access_token = this.jwtService.sign(payload, { expiresIn: '1d' });
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '30d' });

    await this.writeCookie(res, refresh_token);

    return res.json({
      status_code: 200,
      message: 'Login successful',
      access_token,
      refresh_token,
      user,
    });
  }

  async refreshToken(userId: number, res: Response) {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    const access_token = this.jwtService.sign(payload, { expiresIn: '1d' });
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '30d' });
    await this.writeCookie(res, refresh_token);
    return res.json({
      status_code: 200,
      message: 'Token refreshed successfully',
      access_token,
      refresh_token,
    });
  }

  async forgotPassword({ email }: ResendOtpDto) {
    const user = await this.usersRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    const otp = generateOTP();
    await this.mailService.sendOTP(email, String(otp));
    await this.cacheManager.set(email, otp, 60 * 5 * 1000);
    return {
      status_code: 200,
      message: 'OTP sent successfully',
    };
  }

  async resetPassword(
    {email, otp, password }: ResetPasswordDto,
  ) {
    const cachedOtp = await this.cacheManager.get(email);
    if (!cachedOtp || String(cachedOtp) !== otp) {
      throw new BadRequestException(`Invalid or expired OTP`);
    }
    const user = await this.usersRepository.findOne({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    user.password = await BcryptEncryption.encrypt(password);
    await this.usersRepository.save(user);
    await this.cacheManager.del(email);
    return {
      status_code: 200,
      message: 'Password reset successful',
    };
  }

  async logout(refresh_token: string, res: Response) {
  let payload;

  try {
    payload =  this.jwtService.verify(refresh_token);
  } catch (err) {
    throw new BadRequestException('Invalid or expired refresh token');
  }

  const user = await this.usersRepository.findOne({ where: { id: payload.id } });
  if (!user) throw new NotFoundException('User not found');

  user.isActive = false;
  await this.usersRepository.save(user);

  res.clearCookie('refresh_token');

  return {
    status_code: 200,
    message: 'Logout successful',
  };
}


  async createManager(createUserDto: CreateUserDto) {
    const { email, phone } = createUserDto;
    const manager = await this.usersRepository.findOne({ where: { email } });
    if (!manager) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    manager.role = ROLES.MANAGER;
    await this.usersRepository.save(manager);
    return {
      status_code: 201,
      message: 'Manager role assigned successfully',
      manager,
    };
  }

  async findAll() {
    const users = await this.usersRepository.find();
    return {
      status_code: 200,
      message: 'Users retrieved successfully',
      users,
    };
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return {
      status_code: 200,
      message: 'User retrieved successfully',
      user,
    };
  }

 async update(id: number, updateUserDto: UpdateUserDto, file?: Express.Multer.File) {
  const user = await this.usersRepository.findOne({ where: { id } });
  if (!user) throw new NotFoundException(`User with id ${id} not found`);

  // Avatar update
  if (file) {
    if (user.avatar && await this.fileService.existFile(user.avatar)) {
      await this.fileService.deleteFile(user.avatar);
    }

    updateUserDto.avatar = await this.fileService.createFile(file);
  }

  // Password update
  if (updateUserDto.password) {
    const isSame = await BcryptEncryption.compare(updateUserDto.password, user.password);
    if (isSame) throw new BadRequestException('New password must be different');

    updateUserDto.password = await BcryptEncryption.encrypt(updateUserDto.password);
  }

  // Email update
  if (updateUserDto.email && updateUserDto.email !== user.email) {
    const exists = await this.usersRepository.findOneBy({ email: updateUserDto.email });
    if (exists) throw new ConflictException('Email already taken');
  }

  // Phone update
  if (updateUserDto.phone && updateUserDto.phone !== user.phone) {
    const exists = await this.usersRepository.findOneBy({ phone: updateUserDto.phone });
    if (exists) throw new ConflictException('Phone already taken');
  }

  await this.usersRepository.update(id, updateUserDto);
  const updatedUser = await this.usersRepository.findOne({ where: { id } });

  return {
    status_code: 200,
    message: 'User updated successfully',
    user: updatedUser,
  };
}

  async remove(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    await this.usersRepository.delete(id);
    return {
      status_code: 200,
      message: 'User deleted successfully',
    };
  }

  async writeCookie(res: Response, token: string) {
    res.cookie('refresh_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
  }
}
