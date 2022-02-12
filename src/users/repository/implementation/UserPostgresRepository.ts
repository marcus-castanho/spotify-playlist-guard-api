import { PrismaService } from 'src/prisma/prisma.service';
import { IUsersRepository } from '../IUsersRepository';
import { User } from '../../entity/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersPostgresRepository implements IUsersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(user: User): Promise<void> {
    await this.prismaService.user.create({
      data: { ...user },
    });
  }
}
