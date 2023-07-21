import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { SpotifyService } from 'src/spotify/spotify.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { PlaylistsService } from 'src/playlists/playlists.service';
import { SpotifyScrappingService } from 'src/spotify-scrapping/spotify-scrapping.service';
import { User as QueryUser } from 'src/spotify-scrapping/entities/user.entity';
import { Profile } from 'src/spotify-scrapping/entities/profile.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly spotifyService: SpotifyService,
    private readonly prismaService: PrismaService,
    private readonly playlistService: PlaylistsService,
    private readonly spotifyScrappingService: SpotifyScrappingService,
  ) {}

  async upsertUserData(createUserDto: CreateUserDto): Promise<User> {
    const { spotify_id } = createUserDto;

    const newUser = await this.prismaService.user.upsert({
      where: { spotify_id },
      update: { ...createUserDto },
      create: { ...createUserDto },
    });

    await this.setUserTokens(newUser.id);
    await this.playlistService.upsertManyByUserId(newUser.id, spotify_id);

    const newUserWithPlaylists = (await this.prismaService.user.findFirst({
      where: { id: newUser.id },
      include: {
        playlists: true,
      },
    })) as User;

    const userData = this.prismaService.exclude<User, keyof User>(
      newUserWithPlaylists,
      'accessToken',
      'refreshToken',
      'expiresAt',
    );

    return { ...userData };
  }

  async find(id: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user) throw new UnprocessableEntityException();

    return this.prismaService.exclude<User, keyof User>(
      user,
      'accessToken',
      'refreshToken',
      'expiresAt',
    );
  }

  async setUserTokens(id: string): Promise<void> {
    const requestDate = new Date();
    const userTokens = await this.prismaService.user.findUnique({
      where: { id },
      select: {
        accessToken: true,
        refreshToken: true,
        expiresAt: true,
      },
    });

    if (!userTokens) throw new UnprocessableEntityException();

    const { accessToken, refreshToken, expiresAt } = userTokens;

    if (requestDate <= expiresAt) {
      this.spotifyService.setAccessToken(accessToken);
      return;
    }

    this.spotifyService.setRefreshToken(refreshToken);

    const newAccessToken = await this.spotifyService
      .refreshAccessToken()
      .then((data) => {
        this.spotifyService.setAccessToken(data.body.access_token);
        return data.body.access_token;
      });

    await this.prismaService.user.update({
      where: { id },
      data: {
        accessToken: newAccessToken,
      },
    });

    return;
  }

  async listPage(page: number): Promise<Array<User>> {
    if (page <= 0) throw new BadRequestException();

    const users = await this.prismaService.user.findMany({
      skip: page - 1,
      take: 15,
    });

    return users.map((user) =>
      this.prismaService.exclude<User, keyof User>(
        user,
        'accessToken',
        'refreshToken',
        'expiresAt',
      ),
    );
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
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

    return this.prismaService.exclude<User, keyof User>(
      updatedUser,
      'accessToken',
      'refreshToken',
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

  async query(identifier: string): Promise<QueryUser[]> {
    return this.spotifyScrappingService.queryUsers(identifier);
  }

  async getProfile(spotifyId: string): Promise<Profile> {
    return this.spotifyScrappingService.getUser(spotifyId);
  }

  async getProfiles(spotifyIds: string[]): Promise<Profile[]> {
    const users: Profile[] = [];

    for (let i = 0; i < spotifyIds.length; i++) {
      const id = spotifyIds[i];
      const user = await this.spotifyScrappingService.getUser(id);
      users.push(user);
    }

    return users;
  }
}
