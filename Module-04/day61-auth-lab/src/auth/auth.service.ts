import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UsersService, User } from '../users/users.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.users.findByEmail(
      dto.email,
    );

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await argon2.hash(dto.password);

    const user = await this.users.create({
      email: dto.email,
      passwordHash,
    });

    return {
      id: user.id,
      email: user.email,
      roles: user.roles,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.users.findByEmail(dto.email);

    const passwordMatches = user
      ? await argon2.verify(user.passwordHash, dto.password)
      : false;

    if (!user || !passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.issueTokens(user);
  }

  async refresh(presentedToken: string) {
    try {
      const payload = await this.jwt.verifyAsync<{ sub: number }>(
        presentedToken,
        {
          secret: this.config.getOrThrow<string>(
            'JWT_REFRESH_SECRET',
          ),
          algorithms: ['HS256'],
        },
      );

      const user = await this.users.findById(payload.sub);

      if (!user || !user.refreshHash) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const matches = await argon2.verify(
        user.refreshHash,
        presentedToken,
      );

      if (!matches) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return this.issueTokens(user);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: number) {
    await this.users.setRefreshHash(userId, null);
    return { message: 'Logged out' };
  }

  private async issueTokens(user: User) {
    const accessPayload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(accessPayload, {
        secret: this.config.getOrThrow(
          'JWT_ACCESS_SECRET',
        ),
        expiresIn: '15m',
        algorithm: 'HS256',
      }),
      this.jwt.signAsync(
        { sub: user.id },
        {
          secret: this.config.getOrThrow(
            'JWT_REFRESH_SECRET',
          ),
          expiresIn: '7d',
          algorithm: 'HS256',
        },
      ),
    ]);

    await this.users.setRefreshHash(
      user.id,
      await argon2.hash(refreshToken),
    );

    return { accessToken, refreshToken };
  }
}