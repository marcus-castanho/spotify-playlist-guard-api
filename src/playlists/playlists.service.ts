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
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { Playlist } from './entities/playlist.entity';

@Injectable()
export class PlaylistsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly usersService: UsersService,
    private readonly spotifyService: SpotifyService,
  ) {}

  async add(createPlaylistDto: CreatePlaylistDto): Promise<Partial<Playlist>> {
    const { id, allowed_userIds, active, userId } = createPlaylistDto;
    await this.usersService.setUserTokens(userId);

    const playlist: SinglePlaylistResponse = await this.spotifyService
      .getPlaylist(id)
      .then((data) => {
        console.log(data.body);
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
      ...playlistData
    } = playlist;

    const tracksIds = tracks.items.map((track) => track.track.id);

    if (!playlistData.collaborative) {
      throw new ConflictException('Only collaborative playlists are allowed.');
    }

    if (!(await this.usersService.find(owner.id))) {
      throw new UnprocessableEntityException(
        'The Spotify user ID provided is not registered.',
      );
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
        ...playlistData,
        owner: {
          connect: {
            id: owner.id,
          },
        },
      },
    });
  }

  async find(id: string): Promise<Partial<Playlist>> {
    const playlist = await this.prismaService.playlist.findUnique({
      where: { id },
    });

    if (!playlist) throw new UnprocessableEntityException();

    return playlist;
  }

  async listPage(page: number): Promise<Array<Partial<Playlist>>> {
    if (page <= 0) throw new BadRequestException();

    const playlists = await this.prismaService.playlist.findMany({
      skip: page - 1,
      take: 15,
    });

    return playlists;
  }

  async update(
    id: string,
    updatePlaylistDto: UpdatePlaylistDto,
  ): Promise<Partial<Playlist>> {
    const playlist = await this.prismaService.playlist.findUnique({
      where: { id },
    });

    if (!playlist) throw new UnprocessableEntityException();

    const updatedPlaylist = await this.prismaService.playlist.update({
      where: { id },
      data: {
        ...updatePlaylistDto,
      },
    });

    return updatedPlaylist;
  }

  async delete(id: string, res: Response): Promise<void> {
    const playlist = await this.prismaService.playlist.findUnique({
      where: { id },
    });

    if (!playlist) throw new UnprocessableEntityException();

    await this.prismaService.playlist.delete({
      where: { id },
    });

    res.status(204).json();
  }
}
