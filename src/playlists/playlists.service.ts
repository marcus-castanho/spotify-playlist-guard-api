import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { SpotifyService } from 'src/spotify/spotify.service';
import { ActivatePlaylistDto } from './dto/activate-playlist.dto';
import { UpdateAllowedUsersDto } from './dto/update-allowedUsers-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { Playlist } from './entities/playlist.entity';

@Injectable()
export class PlaylistsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly spotifyService: SpotifyService,
  ) {}

  async upsertManyByUserId(
    userId: string,
    userSpotifyId: string,
  ): Promise<void> {
    const page = 1;
    const limit = 50;
    let playlistsResults: SpotifyApi.PlaylistObjectSimplified[] = [];
    let continuePulling = true;

    while (continuePulling) {
      const offsetConfig = (page - 1) * limit;
      const response = await this.spotifyService.getUserPlaylists(
        userSpotifyId,
        {
          limit: 50,
          offset: offsetConfig,
        },
      );

      const { next, items } = response.body;
      playlistsResults = [...playlistsResults, ...items];

      continuePulling = !!next;
    }

    const currentPlaylists = await this.prismaService.playlist.findMany({
      where: {
        owner: {
          id: userId,
        },
      },
    });

    const playlists = playlistsResults
      .map((playlist) => {
        const {
          owner,
          collaborative,
          external_urls,
          description,
          ['public']: isPublic,
          ['id']: spotify_id,
          name,
          href,
          snapshot_id,
          uri,
        } = playlist;

        return {
          collaborative,
          active: collaborative,
          allowed_userIds: [],
          external_url: external_urls.spotify,
          description: description || '',
          public: !!isPublic,
          userId: owner.id,
          spotify_id,
          name,
          href,
          snapshot_id,
          uri,
        };
      })
      .filter((playlist) => {
        return playlist.userId === userId;
      });

    const deletedPlaylistsIds = currentPlaylists
      .filter(({ spotify_id }) => {
        return !playlists
          .map((playlist) => playlist.spotify_id)
          .includes(spotify_id);
      })
      .map(({ id }) => id);
    const updatedPlaylists = playlists.filter(({ spotify_id }) => {
      return currentPlaylists
        .map((playlist) => playlist.spotify_id)
        .includes(spotify_id);
    });
    const createdPlaylists = playlists.filter(({ spotify_id }) => {
      return !currentPlaylists
        .map((playlist) => playlist.spotify_id)
        .includes(spotify_id);
    });

    await this.prismaService.playlist.deleteMany({
      where: {
        id: {
          in: deletedPlaylistsIds,
        },
      },
    });
    await this.prismaService.playlist.createMany({ data: createdPlaylists });

    for (let i = 0; i < updatedPlaylists.length; i++) {
      const { spotify_id } = updatedPlaylists[i];
      await this.prismaService.playlist.update({
        where: { spotify_id },
        data: updatedPlaylists[i],
      });
    }
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
