import { Module } from '@nestjs/common';
import { InMemoryUsersRepository } from './in-memory-users.repository.js';
import { USERS_REPOSITORY } from './users.repository.js';
import { UsersSeed } from './users.seed.js';

@Module({
  providers: [
    { provide: USERS_REPOSITORY, useClass: InMemoryUsersRepository },
    UsersSeed,
  ],
  exports: [USERS_REPOSITORY],
})
export class UsersModule {}