import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { Tokens } from 'src/@types/encryption';
import { EncryptionService } from 'src/encryption/encryption.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { SpotifyService } from 'src/spotify/spotify.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entity/user.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly spotifyService: SpotifyService,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly encryptionService: EncryptionService,
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

    const newTokens = await this.updateUserTokens(accessToken, refreshToken);
    const { ivAccessToken, ivRefreshToken } = newTokens;

    createUserDto.accessToken = newTokens.accessToken;
    createUserDto.refreshToken = newTokens.refreshToken;

    const newUser = await this.prismaService.user.create({
      data: { ivAccessToken, ivRefreshToken, ...createUserDto },
    });

    return this.prismaService.exclude<Partial<User>, keyof Partial<User>>(
      newUser,
      'accessToken',
      'ivAccessToken',
      'refreshToken',
      'ivRefreshToken',
      'expiresAt',
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
      'ivAccessToken',
      'refreshToken',
      'ivRefreshToken',
      'expiresAt',
    );
  }

  async setUserTokens(id: string): Promise<void> {
    const requestDate = new Date();
    const userTokens = await this.prismaService.user.findUnique({
      where: { id },
      select: {
        accessToken: true,
        ivAccessToken: true,
        refreshToken: true,
        ivRefreshToken: true,
        expiresAt: true,
      },
    });

    if (!userTokens) throw new UnprocessableEntityException();

    const { accessToken, ivAccessToken, refreshToken, expiresAt } = userTokens;

    if (requestDate <= expiresAt) {
      userTokens.accessToken = await this.encryptionService.decryptData(
        accessToken,
        ivAccessToken,
      );
      this.spotifyService.setAccessToken(userTokens.accessToken);
      return;
    }

    this.spotifyService.setRefreshToken(refreshToken);

    const newAccessToken = await this.spotifyService
      .refreshAccessToken()
      .then((data) => {
        this.spotifyService.setAccessToken(data.body.access_token);
        return data.body.access_token;
      });

    const encryptedAccessToken = await this.encryptionService.encryptData(
      newAccessToken,
    );
    const newIvAccessToken = encryptedAccessToken.iv;

    await this.prismaService.user.update({
      where: { id },
      data: {
        ivAccessToken: newIvAccessToken,
        accessToken: encryptedAccessToken.encryptedData,
      },
    });

    return;
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
        'ivAccessToken',
        'refreshToken',
        'ivRefreshToken',
        'expiresAt',
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
      const newTokens = await this.updateUserTokens(accessToken, refreshToken);
      const { ivAccessToken, ivRefreshToken } = newTokens;

      updateUserDto.accessToken = newTokens.accessToken;
      updateUserDto.refreshToken = newTokens.refreshToken;

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
      'ivAccessToken',
      'refreshToken',
      'ivRefreshToken',
      'expiresAt',
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

  async updateUserTokens(
    accessToken: string,
    refreshToken: string,
  ): Promise<Tokens> {
    const encryptedAccessToken = await this.encryptionService.encryptData(
      accessToken,
    );
    const encryptedRefreshToken = await this.encryptionService.encryptData(
      refreshToken,
    );
    const ivAccessToken = encryptedAccessToken.iv;
    const ivRefreshToken = encryptedRefreshToken.iv;

    return {
      accessToken: encryptedAccessToken.encryptedData,
      ivAccessToken,
      refreshToken: encryptedRefreshToken.encryptedData,
      ivRefreshToken,
    };
  }
}
