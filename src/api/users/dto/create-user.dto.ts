import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsStrongPassword, MinLength } from "class-validator";
import { ROLES } from "src/common/enum";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    FIO: string;

    @IsEmail()
    email: string;

    @IsString()
    @IsStrongPassword()
    @MinLength(6)
    password: string;

    @IsPhoneNumber('UZ')
    @IsString()
    phone: string;

    @IsOptional()
    avatar?: string;

    @IsOptional()
    passport?: string;

    @IsOptional()
    @IsString()
    login?: string;

    @IsOptional()
    @IsEnum(ROLES)
    role?: ROLES;
}
