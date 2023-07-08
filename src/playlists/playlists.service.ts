import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Response } from 'express';
import { SinglePlaylistResponse } from 'src/@types/spotify-web-api-node';
import { PrismaService } from 'src/prisma/prisma.service';
import { SpotifyService } from 'src/spotify/spotify.service';
import { UsersService } from 'src/users/users.service';
import { ActivatePlaylistDto } from './dto/activate-playlist.dto';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdateAllowedUsersDto } from './dto/update-allowedUsers-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { Playlist } from './entities/playlist.entity';

@Injectable()
export class PlaylistsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly usersService: UsersService,
    private readonly spotifyService: SpotifyService,
  ) {}

  async add(
    userId: string,
    createPlaylistDto: CreatePlaylistDto,
  ): Promise<Playlist> {
    const { id, allowed_userIds, active } = createPlaylistDto;
    function notEmpty<T>(value: T | undefined): value is T {
      return value !== null && value !== undefined;
    }

    await this.usersService.setUserTokens(userId);

    const playlist: SinglePlaylistResponse = await this.spotifyService
      .getPlaylist(id)
      .then((data) => {
        return data.body;
      })
      .catch((error) => {
        throw new NotFoundException(error.message);
      });
    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      images,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      type,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      primary_color,
      tracks,
      owner,
      followers,
      external_urls,
      description,
      ['public']: isPublic,
      ...playlistData
    } = playlist;
    const tracksIds = tracks.items
      .map((trackData) => {
        const { track } = trackData;
        if (!track) return;
        return track.id;
      })
      .filter(notEmpty);

    if (owner.id !== userId) {
      throw new UnprocessableEntityException(
        'The user ID provided does not match the owner of the playlist.',
      );
    }
    if (!playlistData.collaborative) {
      throw new ConflictException('Only collaborative playlists are allowed.');
    }
    if (
      await this.prismaService.playlist.findUnique({
        where: { id: playlistData.id },
      })
    ) {
      throw new ConflictException(
        'The playlist Spotify ID provided is already registered.',
      );
    }

    return await this.prismaService.playlist.create({
      data: {
        active,
        allowed_userIds,
        tracks: tracksIds,
        followers: followers.total,
        external_url: external_urls.spotify,
        description: description || '',
        public: !!isPublic,
        ...playlistData,
        owner: {
          connect: {
            id: owner.id,
          },
        },
      },
    });
  }

  async find(userId: string, id: string): Promise<Playlist> {
    const playlist = await this.prismaService.playlist.findUnique({
      where: { id },
    });

    if (!playlist || playlist.userId !== userId) {
      throw new NotFoundException(
        'There is no playlist match for the provided ID',
      );
    }

    return playlist;
  }

  async findAllActive(): Promise<Playlist[]> {
    const playlists = await this.prismaService.playlist.findMany({
      where: {
        active: true,
      },
      include: {
        owner: true,
      },
    });

    return playlists;
  }

  async listPage(userId: string, page: number): Promise<Array<Playlist>> {
    if (page <= 0) throw new BadRequestException();

    const playlists = await this.prismaService.playlist.findMany({
      where: {
        owner: {
          id: userId,
        },
      },
      skip: page - 1,
      take: 15,
    });

    return playlists;
  }

  async update(
    id: string,
    updatePlaylistDto: UpdatePlaylistDto,
  ): Promise<Playlist> {
    const playlist = await this.prismaService.playlist.findUnique({
      where: { id },
    });

    if (!playlist)
      throw new NotFoundException(
        'There is no playlist match for the provided ID',
      );

    if (
      updatePlaylistDto.hasOwnProperty('public') ||
      updatePlaylistDto.hasOwnProperty('collaborative')
    ) {
      const { collaborative } = updatePlaylistDto;
      const isPublic = updatePlaylistDto.public;
      if (isPublic || !collaborative) updatePlaylistDto.active = !collaborative;
    }
    const updatedPlaylist = await this.prismaService.playlist.update({
      where: { id },
      data: {
        ...updatePlaylistDto,
      },
    });
    return updatedPlaylist;
  }

  async activate(
    userId: string,
    id: string,
    activatePlaylistDto: ActivatePlaylistDto,
  ): Promise<any> {
    const { active } = activatePlaylistDto;
    const playlist = await this.prismaService.playlist.findUnique({
      where: { id },
    });

    if (!playlist || playlist.userId !== userId) {
      throw new UnprocessableEntityException();
    }

    await this.prismaService.playlist.update({
      where: { id },
      data: {
        active,
      },
    });

    return { active };
  }

  async updateAllowedUsers(
    userId: string,
    id: string,
    updateAllowedUsersDto: UpdateAllowedUsersDto,
  ): Promise<Playlist> {
    const { allowed_userIds } = updateAllowedUsersDto;
    const playlist = await this.prismaService.playlist.findUnique({
      where: { id },
    });

    if (!playlist || playlist.userId !== userId) {
      throw new UnprocessableEntityException();
    }

    return this.prismaService.playlist.update({
      where: { id },
      data: {
        allowed_userIds,
      },
    });
  }

  async delete(userId: string, id: string, res: Response): Promise<void> {
    const playlist = await this.prismaService.playlist.findUnique({
      where: { id },
    });

    if (!playlist || playlist.userId !== userId) {
      throw new UnprocessableEntityException();
    }

    await this.prismaService.playlist.delete({
      where: { id },
    });

    res.status(204).json();

    return;
  }
}
