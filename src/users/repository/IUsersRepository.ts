import { User } from '../entity/user.entity';

interface IUsersRepository {
  create(user: User): Promise<void>;
}

export { IUsersRepository };
