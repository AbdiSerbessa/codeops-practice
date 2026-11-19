export type Role = 'user' | 'staff' | 'admin';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  roles: Role[];
  refreshHash: string | null;
}

export type SafeUser = Omit<User, 'passwordHash' | 'refreshHash'>;