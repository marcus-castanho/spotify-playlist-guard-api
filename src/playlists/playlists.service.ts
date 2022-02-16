import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { Playlist } from './entities/playlist.entity';

@Injectable()
export class PlaylistsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async create(
    createPlaylistDto: CreatePlaylistDto,
  ): Promise<Partial<Playlist>> {
    const { userId, ...playlistData } = createPlaylistDto;

    if (!playlistData.collaborative) {
      throw new ConflictException('Only collaborative playlists are allowed.');
    }

    if (!(await this.usersService.find(userId))) {
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
        ...playlistData,
        owner: {
          connect: {
            id: userId,
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
