import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { AuthService } from './auth.service.js';
import { LoginDto, RefreshTokenDto, RegisterDto } from './dto/auth.dto.js';
import type { AuthenticatedUser } from './jwt.strategy.js';
import { Public } from './public.decorator.js';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user account' })
  @ApiCreatedResponse({ description: 'User registered (201)' })
  @ApiConflictResponse({ description: 'Email already exists (409)' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log in with email and password for JWT tokens' })
  @ApiOkResponse({ description: 'Authenticated with access & refresh tokens (200)' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials (401)' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rotate access and refresh tokens using a valid refresh token' })
  @ApiOkResponse({ description: 'Tokens rotated (200)' })
  @ApiUnauthorizedResponse({ description: 'Invalid refresh token (401)' })
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto.refreshToken);
  }

  @Get('me')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Get authenticated user profile from JWT' })
  @ApiOkResponse({ description: 'Current user returned (200)' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT (401)' })
  me(@Req() req: Request & { user: AuthenticatedUser }) {
    return req.user;
  }
}