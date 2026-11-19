import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { User } from './user.entity.js';
import type { CreateUserInput, UsersRepository } from './users.repository.js';

@Injectable()
export class InMemoryUsersRepository implements UsersRepository {
  private readonly users: User[] = [];

  async findById(id: string): Promise<User | null> {
    return this.users.find((u) => u.id === id) ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const normalized = email.trim().toLowerCase();
    return this.users.find((u) => u.email.toLowerCase() === normalized) ?? null;
  }

  async create(input: CreateUserInput): Promise<User> {
    const user: User = {
      id: randomUUID(),
      email: input.email.trim().toLowerCase(),
      passwordHash: input.passwordHash,
      roles: input.roles,
      refreshHash: input.refreshHash ?? null,
    };
    this.users.push(user);
    return user;
  }

  async updateRefreshHash(
    userId: string,
    refreshHash: string | null,
  ): Promise<void> {
    const user = this.users.find((u) => u.id === userId);
    if (user) {
      user.refreshHash = refreshHash;
    }
  }

  async findAll(): Promise<User[]> {
    return [...this.users];
  }
}