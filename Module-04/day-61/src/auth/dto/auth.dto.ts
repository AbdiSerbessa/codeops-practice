import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'newuser@addiseats.et' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'StrongPass123!', minLength: 8 })
  @IsString()
  @MinLength(8)
  password!: string;
}

export class LoginDto {
  @ApiProperty({ example: 'customer1@addiseats.et' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'Password123!' })
  @IsString()
  @IsNotEmpty()
  password!: string;
}

export class RefreshTokenDto {
  @ApiProperty({ example: '<refresh-token-jwt>' })
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}