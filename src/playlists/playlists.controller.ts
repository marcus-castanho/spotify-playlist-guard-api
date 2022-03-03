import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Res,
  UseGuards,
} from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { Playlist } from './entities/playlist.entity';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { Response } from 'express';
import { ReqUser } from 'src/auth/decorators/user.decorator';
import { ActivatePlaylistDto } from './dto/activate-playlist.dto copy';
import { UpdateAllowedUsersDto } from './dto/update-allowedUsers-playlist.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { ExternalAppGuard } from 'src/auth/guards/external-app.guard';

@Controller('playlists')
export class PlaylistsController {
  constructor(private readonly playlistsService: PlaylistsService) {}

  @Post('/add')
  add(
    @ReqUser('sub') userId: string,
    @Body() createPlaylistDto: CreatePlaylistDto,
  ): Promise<Partial<Playlist>> {
    return this.playlistsService.add(userId, createPlaylistDto);
  }

  @Get('/find/:id')
  find(
    @ReqUser('sub') userId: string,
    @Param('id') id: string,
  ): Promise<Partial<Playlist>> {
    return this.playlistsService.find(userId, id);
  }

  @Get('/list/:page')
  listPage(
    @ReqUser('sub') userId: string,
    @Param('page') page: number,
  ): Promise<Array<Partial<Playlist>>> {
    return this.playlistsService.listPage(userId, page);
  }

  @Patch('/active/:id')
  activate(
    @ReqUser('sub') userId: string,
    @Param('id') id: string,
    @Body() activatePlaylistDto: ActivatePlaylistDto,
  ): Promise<Partial<Playlist>> {
    return this.playlistsService.activate(userId, id, activatePlaylistDto);
  }

  @Patch('/allowUsers/:id')
  updateAllowedUsers(
    @ReqUser('sub') userId: string,
    @Param('id') id: string,
    @Body() updateAllowedUsersDto: UpdateAllowedUsersDto,
  ): Promise<Partial<Playlist>> {
    return this.playlistsService.updateAllowedUsers(
      userId,
      id,
      updateAllowedUsersDto,
    );
  }

  @Delete('/delete/:id')
  delete(
    @ReqUser('sub') userId: string,
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<void> {
    return this.playlistsService.delete(userId, id, res);
  }

  @Public()
  @UseGuards(ExternalAppGuard)
  @Get('findAll/active')
  async findAllActive() {
    return this.playlistsService.findAllActive();
  }

  @Public()
  @UseGuards(ExternalAppGuard)
  @Patch('/update/:id')
  update(
    @Param('id') id: string,
    @Body() updatePlaylistDto: UpdatePlaylistDto,
  ): Promise<Partial<Playlist>> {
    return this.playlistsService.update(id, updatePlaylistDto);
  }
}
