export type Role = 'customer' | 'staff' | 'courier' | 'admin';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  roles: Role[];
  restaurantId?: string;
  refreshHash: string | null;
}

export type SafeUser = Omit<User, 'passwordHash' | 'refreshHash'>;