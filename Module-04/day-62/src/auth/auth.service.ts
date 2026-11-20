import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import type { SafeUser, User } from '../users/user.entity.js';
import { USERS_REPOSITORY, type UsersRepository } from '../users/users.repository.js';
import type { JwtAccessPayload } from './jwt.strategy.js';

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
    const { passwordHash: _pw, refreshHash: _rh, ...safe } = user;
    return safe;
  }

  private async issueTokens(user: User): Promise<AuthTokens> {
    const accessPayload: JwtAccessPayload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
      restaurantId: user.restaurantId,
      type: 'access',
    };

    const refreshPayload: JwtAccessPayload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
      restaurantId: user.restaurantId,
      type: 'refresh',
    };

    const accessToken = await this.jwtService.signAsync(accessPayload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN ?? '15m') as never,
      algorithm: 'HS256',
    });

    const refreshToken = await this.jwtService.signAsync(refreshPayload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN ?? '7d') as never,
      algorithm: 'HS256',
    });

    const refreshHash = await argon2.hash(refreshToken);
    await this.usersRepo.updateRefreshHash(user.id, refreshHash);

    return {
      accessToken,
      refreshToken,
      user: this.toSafeUser(user),
    };
  }

  async register(email: string, password: string): Promise<SafeUser> {
    const existing = await this.usersRepo.findByEmail(email);
    if (existing) {
      throw new ConflictException('Email is already registered');
    }

    const passwordHash = await argon2.hash(password);
    const created = await this.usersRepo.create({
      email,
      passwordHash,
      roles: ['customer'],
      refreshHash: null,
    });

    return this.toSafeUser(created);
  }

  async login(email: string, password: string): Promise<AuthTokens> {
    const user = await this.usersRepo.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await argon2.verify(user.passwordHash, password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.issueTokens(user);
  }

  async refresh(refreshToken: string): Promise<AuthTokens> {
    let payload: JwtAccessPayload;
    try {
      payload = await this.jwtService.verifyAsync<JwtAccessPayload>(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
        algorithms: ['HS256'],
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (payload.type !== 'refresh' || !payload.sub) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.usersRepo.findById(payload.sub);
    if (!user || !user.refreshHash) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const matches = await argon2.verify(user.refreshHash, refreshToken);
    if (!matches) {
      await this.usersRepo.updateRefreshHash(user.id, null);
      throw new UnauthorizedException('Invalid refresh token');
    }

    return this.issueTokens(user);
  }
}