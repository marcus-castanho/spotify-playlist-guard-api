import { User } from '@prisma/client';

interface IUserRepository {
  create(user: User): Promise<void>;
}

export { IUserRepository };
