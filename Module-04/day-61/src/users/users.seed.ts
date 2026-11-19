import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import * as argon2 from 'argon2';
import { USERS_REPOSITORY, type UsersRepository } from './users.repository.js';

@Injectable()
export class UsersSeed implements OnModuleInit {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepo: UsersRepository,
  ) {}

  async onModuleInit(): Promise<void> {
    const seeds = [
      {
        email: 'customer1@addiseats.et',
        password: 'Password123!',
        roles: ['user' as const],
      },
      {
        email: 'customer2@addiseats.et',
        password: 'Password123!',
        roles: ['user' as const],
      },
      {
        email: 'staff@addiseats.et',
        password: 'StaffPassword123!',
        roles: ['staff' as const],
      },
    ];

    for (const item of seeds) {
      const existing = await this.usersRepo.findByEmail(item.email);
      if (!existing) {
        const passwordHash = await argon2.hash(item.password);
        await this.usersRepo.create({
          email: item.email,
          passwordHash,
          roles: item.roles,
          refreshHash: null,
        });
      }
    }
  }
}