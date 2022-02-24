import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { Response } from 'express';
import { EncryptedData } from 'src/@types/encryption';
import { PrismaService } from 'src/prisma/prisma.service';
import { promisify } from 'util';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entity/user.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {}

  async createIfNotExists(
    createUserDto: CreateUserDto,
  ): Promise<Partial<User>> {
    const { id, accessToken, refreshToken } = createUserDto;

    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (user) {
      return this.update(id, createUserDto);
    }

    const encryptedAccessToken = await this.encryptData(accessToken);
    const encryptedRefreshToken = await this.encryptData(refreshToken);
    const ivAccessToken = encryptedAccessToken.iv;
    const ivRefreshToken = encryptedRefreshToken.iv;

    createUserDto.accessToken = encryptedAccessToken.encryptedData;
    createUserDto.refreshToken = encryptedRefreshToken.encryptedData;

    const newUser = await this.prismaService.user.create({
      data: { ivAccessToken, ivRefreshToken, ...createUserDto },
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
    let updatedUser: Partial<User>;
    const { accessToken, refreshToken } = updateUserDto;
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user) throw new UnprocessableEntityException();

    if (accessToken || refreshToken) {
      const encryptedAccessToken = await this.encryptData(accessToken);
      const encryptedRefreshToken = await this.encryptData(refreshToken);
      const ivAccessToken = encryptedAccessToken.iv;
      const ivRefreshToken = encryptedRefreshToken.iv;

      updateUserDto.accessToken = encryptedAccessToken.encryptedData;
      updateUserDto.refreshToken = encryptedRefreshToken.encryptedData;

      updatedUser = await this.prismaService.user.update({
        where: { id },
        data: {
          ivAccessToken,
          ivRefreshToken,
          ...updateUserDto,
        },
      });
    }

    updatedUser = await this.prismaService.user.update({
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

  async encryptData(data: string): Promise<EncryptedData> {
    const bufferData = Buffer.from(data, 'utf-8');
    const iv = randomBytes(16);
    const password = this.configService.get<string>('ENCRYPTION_PASSWORD');
    const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
    const cipher = createCipheriv('aes-256-ctr', key, iv);

    const encryptedData = Buffer.concat([
      cipher.update(bufferData),
      cipher.final(),
    ]);

    return {
      iv: iv.toString('hex'),
      encryptedData: encryptedData.toString('hex'),
    };
  }

  async decryptData(data: string, iv: string): Promise<string> {
    const bufferIv = Buffer.from(iv, 'hex');
    const bufferData = Buffer.from(data, 'hex');
    const password = this.configService.get<string>('ENCRYPTION_PASSWORD');
    const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
    const decipher = createDecipheriv('aes-256-ctr', key, bufferIv);

    const decryptedData = Buffer.concat([
      decipher.update(bufferData),
      decipher.final(),
    ]);

    return decryptedData.toString();
  }
}
