import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Teacher } from 'src/core/entities/teacher.entity';
import { DataSource, Repository } from 'typeorm';
import { TeacherAvatar } from 'src/core/entities/teacher-avatar.entity';
import { FileService } from '../file/file.service';
import { BcryptEncryption } from 'src/infrastructure/lib/bcrypt';
import { MailService } from 'src/infrastructure/lib/mail/mail.service';
import { generateOTP } from 'src/infrastructure/lib/otp-generator/generateOTP';
import { ConfirmOtpDto } from './dto/confirm-otp.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { TeacherloginDto } from './dto/teacher-login.dto';
@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
    @InjectRepository(TeacherAvatar)
    private readonly avatarRepository: Repository<TeacherAvatar>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly dataSource: DataSource,
    private readonly fileService: FileService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    createTeacherDto: CreateTeacherDto,
    avatar?: Express.Multer.File,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const existsEmail = await queryRunner.manager.findOne(Teacher, {
        where: { email: createTeacherDto.email },
      });
      const existsPhone = await queryRunner.manager.findOne(Teacher, {
        where: { phone: createTeacherDto.phone },
      });
      if (existsEmail) throw new ConflictException('Email already exists');
      if (existsPhone) throw new ConflictException('Phone already exists');
      createTeacherDto.password = await BcryptEncryption.encrypt(
        createTeacherDto.password,
      );
      const teacher = queryRunner.manager.create(Teacher, createTeacherDto);
      await queryRunner.manager.save(teacher);
      if (avatar) {
        const savedAvatar = await this.fileService.createFile(avatar);
        const teacherAvatar = queryRunner.manager.create(TeacherAvatar, {
          image_url: savedAvatar,
        });
        await queryRunner.manager.save(teacherAvatar);
        teacher.avatar = teacherAvatar;
        await queryRunner.manager.save(teacher);
      }
      const otp = generateOTP();
      await this.mailService.sendOTP(teacher.email, String(otp));
      await this.cacheManager.set(teacher.email, otp, 60 * 5 * 1000); // 5 minutes
      await queryRunner.commitTransaction();
      console.log(teacher.email, 'teacher-otp', otp);
      return {
        status_code: 201,
        message: 'Teacher registered successfully',
        teacher,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        `Failed to register teacher: ${error.message}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async otpResend(email: string) {
    const teacher = await this.teacherRepository.findOne({ where: { email } });
    if (!teacher) throw new NotFoundException('Teacher not found');
    const otp = generateOTP();
    await this.mailService.sendOTP(teacher.email, String(otp));
    await this.cacheManager.set(teacher.email, otp, 60 * 5 * 1000);
    return {
      status_code: 200,
      message: 'OTP resent successfully',
    };
  }

  async confirmOtp({ email, otp }: ConfirmOtpDto, res: Response) {
    const cachedOtp = await this.cacheManager.get(email);
    if (!cachedOtp || String(cachedOtp) !== String(otp))
      throw new BadRequestException('Invalid OTP');
    const teacher = await this.teacherRepository.findOne({ where: { email } });
    if (!teacher) throw new NotFoundException('Teacher not found');
    teacher.isVerified = true;
    await this.teacherRepository.save(teacher);
    await this.cacheManager.del(email);
    const payload = {
      id: teacher.id,
      email: teacher.email,
      role: teacher.role,
    };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '30d' });
    await this.writeCookie(res, refreshToken);
    return res.json({
      status_code: 200,
      message: 'OTP confirmed successfully',
      access_token: accessToken,
    });
  }

  async login({ email, password }: TeacherloginDto, res: Response) {
    const teacher = await this.teacherRepository.findOne({ where: { email } });
    if (!teacher) throw new BadRequestException('Invalid credentials');
    const isPasswordValid = await BcryptEncryption.compare(
      password,
      teacher.password,
    );
    if (!isPasswordValid) throw new BadRequestException('Invalid credentials');
    const payload = {
      id: teacher.id,
      email: teacher.email,
      role: teacher.role,
    };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '30d' });
    await this.writeCookie(res, refreshToken);
    return res.json({
      status_code: 200,
      message: 'Login successful',
      access_token: accessToken,
    });
  }

  async refreshToken(teacherId: number, res: Response) {
    const teacher = await this.teacherRepository.findOne({
      where: { id: teacherId },
    });
    if (!teacher) throw new NotFoundException('Teacher not found');
    const payload = {
      id: teacher.id,
      email: teacher.email,
      role: teacher.role,
    };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '30d' });
    await this.writeCookie(res, refreshToken);
    return res.json({
      status_code: 200,
      message: 'Token refreshed successfully',
      access_token: accessToken,
    });
  }

  async me(teacherId: number) {
    const teacher = await this.teacherRepository.findOne({
      where: { id: teacherId }, relations: ['avatar'],
    });
    if (!teacher) throw new NotFoundException('Teacher not found');
    return {
      status_code: 200,
      message: 'Teacher profile retrieved successfully',
      teacher,
    };
  }

  async forgotPassword(email: string) {
    const teacher = await this.teacherRepository.findOne({ where: { email } });
    if (!teacher) throw new NotFoundException('Teacher not found');
    const otp = generateOTP();
    await this.mailService.sendOTP(email, String(otp));
    await this.cacheManager.set(email, otp, 60 * 5 * 1000);
    return {
      status_code: 200,
      message: 'OTP sent successfully',
    };
  }

  async resetPassword(
    { email, otp }: ConfirmOtpDto,
    newPassword: string,
    res: Response,
  ) {
    const cachedOtp = await this.cacheManager.get(email);
    if (!cachedOtp || String(cachedOtp) !== String(otp))
      throw new BadRequestException('Invalid OTP');
    const teacher = await this.teacherRepository.findOne({ where: { email } });
    if (!teacher) throw new NotFoundException('Teacher not found');
    teacher.password = await BcryptEncryption.encrypt(newPassword);
    await this.teacherRepository.save(teacher);
    await this.cacheManager.del(email);
    const payload = {
      id: teacher.id,
      email: teacher.email,
      role: teacher.role,
    };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '30d' });
    await this.writeCookie(res, refreshToken);
    return res.json({
      status_code: 200,
      message: 'Password reset successful',
      access_token: accessToken,
    });
  }

  async logout(res: Response) {
    res.clearCookie('refresh_token');
    return res.json({
      status_code: 200,
      message: 'Logout successful',
    });
  }

  async findAll() {
    const teachers = await this.teacherRepository.find({
      relations: ['avatar'],
    });
    return {
      status_code: 200,
      message: 'Teachers retrieved successfully',
      teachers,
    };
  }

  async findOne(id: number) {
    const teacher = await this.teacherRepository.findOne({
      where: { id },
      relations: ['avatar'],
    });
    if (!teacher)
      throw new NotFoundException(`Teacher with id ${id} not found`);
    return {
      status_code: 200,
      message: 'Teacher retrieved successfully',
      teacher,
    };
  }

  async update(
    id: number,
    updateTeacherDto: UpdateTeacherDto,
    avatar?: Express.Multer.File,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const teacher = await queryRunner.manager.findOne(Teacher, {
        where: { id },
      });
      if (!teacher)
        throw new NotFoundException(`Teacher with id ${id} not found`);
      if (avatar) {
        if (await this.fileService.existFile(teacher.avatar.image_url)) {
          await this.fileService.deleteFile(teacher.avatar.image_url);
          const savedAvatar = await this.fileService.createFile(avatar);
          const avatarEntity = await this.avatarRepository.findOne({
            where: { id: teacher.avatar.id },
          });
          if (!avatarEntity) {
            throw new NotFoundException(
              `Avatar not found for teacher with id ${id}`,
            );
          }
          const avatarToUpdate = await queryRunner.manager.update(
            TeacherAvatar,
            teacher.avatar.id,
            {
              image_url: savedAvatar,
            },
          );
          teacher.avatar.image_url = savedAvatar;
          await queryRunner.manager.save(teacher.avatar);
        }
      }
      if (updateTeacherDto.password) {
        updateTeacherDto.password = await BcryptEncryption.encrypt(
          updateTeacherDto.password,
        );
      }
      Object.assign(teacher, updateTeacherDto);
      await queryRunner.manager.save(teacher);
      await queryRunner.commitTransaction();
      return {
        status_code: 200,
        message: 'Teacher updated successfully',
        teacher,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        `Failed to update teacher: ${error.message}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const teacher = await queryRunner.manager.findOne(Teacher, {
        where: { id },
      });
      if (!teacher)
        throw new NotFoundException(`Teacher with id ${id} not found`);

      if (teacher.avatar) {
        if (await this.fileService.existFile(teacher.avatar.image_url)) {
          await this.avatarRepository.delete({ id: teacher.avatar.id });
          await this.fileService.deleteFile(teacher.avatar.image_url);
        }
      }
      await queryRunner.manager.remove(teacher);
      return {
        status_code: 200,
        message: 'Teacher deleted successfully',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        `Failed to delete teacher: ${error.message}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async writeCookie(res: Response, token: string) {
    res.cookie('refresh_token', token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
  }
}
