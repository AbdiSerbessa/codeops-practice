import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { USERS_REPOSITORY, type UsersRepository } from '../users/users.repository.js';
import type { Role, SafeUser, User } from '../users/user.entity.js';
import type { LoginDto, RegisterDto } from './dto/auth.dto.js';
import type { AuthenticatedUser, JwtAccessPayload } from './jwt.strategy.js';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: SafeUser;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepo: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  private toSafeUser(user: User): SafeUser {
    return {
      id: user.id,
      email: user.email,
      roles: user.roles,
    };
  }

  private async issueTokens(user: User): Promise<AuthTokens> {
    const accessSecret = process.env.JWT_ACCESS_SECRET;
    const refreshSecret = process.env.JWT_REFRESH_SECRET;
    if (!accessSecret || !refreshSecret) {
      throw new Error('JWT secrets are not configured');
    }

    const payload: JwtAccessPayload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
    };

    const accessToken = await this.jwtService.signAsync(
      { ...payload, type: 'access' },
      {
        secret: accessSecret,
        algorithm: 'HS256',
        expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN || '15m') as never,
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      { ...payload, type: 'refresh' },
      {
        secret: refreshSecret,
        algorithm: 'HS256',
        expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as never,
      },
    );

    const refreshHash = await argon2.hash(refreshToken);
    await this.usersRepo.updateRefreshHash(user.id, refreshHash);

    return {
      accessToken,
      refreshToken,
      user: this.toSafeUser(user),
    };
  }

  async register(dto: RegisterDto): Promise<{ user: SafeUser }> {
    const existing = await this.usersRepo.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email is already registered');
    }

    const passwordHash = await argon2.hash(dto.password);
    const created = await this.usersRepo.create({
      email: dto.email,
      passwordHash,
      roles: ['user'] as Role[],
      refreshHash: null,
    });

    return { user: this.toSafeUser(created) };
  }

  async login(dto: LoginDto): Promise<AuthTokens> {
    const genericError = 'Invalid credentials';
    const user = await this.usersRepo.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException(genericError);
    }

    const validPassword = await argon2.verify(user.passwordHash, dto.password);
    if (!validPassword) {
      throw new UnauthorizedException(genericError);
    }

    return this.issueTokens(user);
  }

  async refresh(refreshToken: string): Promise<AuthTokens> {
    const refreshSecret = process.env.JWT_REFRESH_SECRET;
    if (!refreshSecret) {
      throw new Error('JWT_REFRESH_SECRET is not configured');
    }

    let decoded: JwtAccessPayload;
    try {
      decoded = await this.jwtService.verifyAsync<JwtAccessPayload>(
        refreshToken,
        {
          secret: refreshSecret,
          algorithms: ['HS256'],
        },
      );
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.usersRepo.findById(decoded.sub);
    if (!user || !user.refreshHash) {
      throw new UnauthorizedException('Refresh session is invalid');
    }

    const matchesStoredHash = await argon2.verify(user.refreshHash, refreshToken);
    if (!matchesStoredHash) {
      throw new UnauthorizedException('Refresh token does not match');
    }

    // Rotate both access and refresh tokens
    return this.issueTokens(user);
  }

  getMe(user: AuthenticatedUser): AuthenticatedUser {
    return user;
  }
}