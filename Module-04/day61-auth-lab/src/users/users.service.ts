import { Injectable } from '@nestjs/common';

export interface User {
  id: number;
  email: string;
  passwordHash: string;
  roles: string[];
  refreshHash: string | null;
}

@Injectable()
export class UsersService {
  // Temporary storage for this classroom demonstration.


//4. asittimmoo bifa array tinn nuuf kuusa

  private users: User[] = [];
  private nextId = 1;

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.email === email);
  }

  async findById(id: number): Promise<User | undefined> {
    return this.users.find((user) => user.id === id);
  }


  //5. actual asitti uumama
  async create(data: {
    email: string;
    passwordHash: string;
  }): Promise<User> {
    const user: User = {
      id: this.nextId++,
      email: data.email,
      passwordHash: data.passwordHash,
      roles: ['customer'],
      refreshHash: null,
    };

    this.users.push(user);
    return user;
  }

  async setRefreshHash(
    id: number,
    hash: string | null,
  ): Promise<void> {
    const user = await this.findById(id);
    if (user) {
      user.refreshHash = hash;
    }
  }
}