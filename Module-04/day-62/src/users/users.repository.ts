import type { Role, User } from './user.entity.js';

export const USERS_REPOSITORY = Symbol('USERS_REPOSITORY');

export interface CreateUserInput {
  id?: string;
  email: string;
  passwordHash: string;
  roles: Role[];
  restaurantId?: string;
  refreshHash?: string | null;
}

export interface UsersRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(input: CreateUserInput): Promise<User>;
  updateRefreshHash(userId: string, refreshHash: string | null): Promise<void>;
  findAll(): Promise<User[]>;
}