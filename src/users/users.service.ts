import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entity/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<Partial<User>> {
    const { id } = createUserDto;

    if (await this.prismaService.user.findUnique({ where: { id } })) {
      throw new ConflictException(
        'The spotify user id provided is already registered.',
      );
    }

    const user = await this.prismaService.user.create({
      data: { ...createUserDto },
    });

    return this.prismaService.exclude<Partial<User>, keyof Partial<User>>(
      user,
      'refresh_token',
    );
  }

  async find(id: string): Promise<Partial<User>> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user) throw new UnprocessableEntityException();

    return this.prismaService.exclude<Partial<User>, keyof Partial<User>>(
      user,
      'refresh_token',
    );
  }

  async listPage(page: number): Promise<Array<Partial<User>>> {
    if (page <= 0) throw new BadRequestException();

    const users = await this.prismaService.user.findMany({
      skip: page - 1,
      take: 15,
    });

    return users.map((user) =>
      this.prismaService.exclude<Partial<User>, keyof Partial<User>>(
        user,
        'refresh_token',
      ),
    );
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<Partial<User>> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user) throw new UnprocessableEntityException();

    const updatedUser = await this.prismaService.user.update({
      where: { id },
      data: {
        ...updateUserDto,
      },
    });

    return this.prismaService.exclude<Partial<User>, keyof Partial<User>>(
      updatedUser,
      'refresh_token',
    );
  }

  async delete(id: string, res: Response): Promise<void> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user) throw new UnprocessableEntityException();

    await this.prismaService.user.delete({
      where: { id },
    });

    res.status(204).json();
  }
}
