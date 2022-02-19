import {
  BadRequestException,
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

  async createIfNotExists(
    createUserDto: CreateUserDto,
  ): Promise<Partial<User>> {
    const { id } = createUserDto;

    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (user) {
      return this.updateIfDifferent(user, createUserDto);
    }

    const newUser = await this.prismaService.user.create({
      data: { ...createUserDto },
    });

    return this.prismaService.exclude<Partial<User>, keyof Partial<User>>(
      newUser,
      'accessToken',
      'refreshToken',
      'expires_in',
    );
  }

  async find(id: string): Promise<Partial<User>> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user) throw new UnprocessableEntityException();

    return this.prismaService.exclude<Partial<User>, keyof Partial<User>>(
      user,
      'accessToken',
      'refreshToken',
      'expires_in',
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
        'accessToken',
        'refreshToken',
        'expires_in',
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
      'accessToken',
      'refreshToken',
      'expires_in',
    );
  }

  async updateIfDifferent(user: Partial<User>, incomingData: CreateUserDto) {
    const differentProps = Object.keys(user).filter((prop) => {
      const ingoredProps = ['playlists', 'createdAt', 'updatedAt'];

      if (user[prop] !== incomingData[prop] && !ingoredProps.includes(prop))
        return true;

      return false;
    });

    return differentProps.length > 0
      ? await this.update(user.id, incomingData)
      : this.prismaService.exclude<Partial<User>, keyof Partial<User>>(
          user,
          'accessToken',
          'refreshToken',
          'expires_in',
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
