import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
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
        id: 'user-customer-1',
        email: 'customer1@addiseats.et',
        password: 'Password123!',
        roles: ['customer' as const],
      },
      {
        id: 'user-customer-2',
        email: 'customer2@addiseats.et',
        password: 'Password123!',
        roles: ['customer' as const],
      },
      {
        id: 'user-courier-1',
        email: 'courier@addiseats.et',
        password: 'Password123!',
        roles: ['courier' as const],
      },
      {
        id: 'user-staff-1',
        email: 'staff@addiseats.et',
        password: 'Password123!',
        roles: ['staff' as const],
        restaurantId: 'rest-1',
      },
      {
        id: 'user-admin-1',
        email: 'admin@addiseats.et',
        password: 'Password123!',
        roles: ['admin' as const],
      },
    ];

    for (const item of seeds) {
      const existing = await this.usersRepo.findByEmail(item.email);
      if (!existing) {
        const passwordHash = await argon2.hash(item.password);
        await this.usersRepo.create({
          id: item.id,
          email: item.email,
          passwordHash,
          roles: item.roles,
          restaurantId: item.restaurantId,
          refreshHash: null,
        });
      }
    }
  }
}