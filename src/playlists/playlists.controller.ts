import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Res,
} from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { Playlist } from './entities/playlist.entity';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { Response } from 'express';

@Controller('playlists')
export class PlaylistsController {
  constructor(private readonly playlistsService: PlaylistsService) {}

  @Post('/create')
  create(
    @Body() createPlaylistDto: CreatePlaylistDto,
  ): Promise<Partial<Playlist>> {
    return this.playlistsService.create(createPlaylistDto);
  }

  @Get('/find/:id')
  find(@Param('id') id: string): Promise<Partial<Playlist>> {
    return this.playlistsService.find(id);
  }

  @Get('/list/:page')
  listPage(@Param('page') page: number): Promise<Array<Partial<Playlist>>> {
    return this.playlistsService.listPage(page);
  }

  @Patch('/update/:id')
  update(
    @Param('id') id: string,
    @Body() updatePlaylistDto: UpdatePlaylistDto,
  ): Promise<Partial<Playlist>> {
    return this.playlistsService.update(id, updatePlaylistDto);
  }

  @Delete('/delete/:id')
  delete(@Param('id') id: string, @Res() res: Response): Promise<void> {
    return this.playlistsService.delete(id, res);
  }
}
