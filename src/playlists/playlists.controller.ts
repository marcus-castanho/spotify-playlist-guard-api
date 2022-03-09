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
  HttpCode,
} from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { Playlist } from './entities/playlist.entity';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { Response } from 'express';
import { ReqUser } from 'src/auth/decorators/user.decorator';
import { ActivatePlaylistDto } from './dto/activate-playlist.dto';
import { UpdateAllowedUsersDto } from './dto/update-allowedUsers-playlist.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { ExternalAppGuard } from 'src/auth/guards/external-app.guard';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ResPlaylistDto } from './dto/response-playlist.dto';
import { ResActivePlaylistDto } from './dto/response-active-playlist.dto';

@ApiTags('Playlists')
@ApiBearerAuth()
@Controller('playlists')
export class PlaylistsController {
  constructor(private readonly playlistsService: PlaylistsService) {}

  @ApiCreatedResponse({ type: ResPlaylistDto })
  @Post('/add')
  add(
    @ReqUser('sub') userId: string,
    @Body() createPlaylistDto: CreatePlaylistDto,
  ): Promise<Playlist> {
    return this.playlistsService.add(userId, createPlaylistDto);
  }

  @ApiOkResponse({ type: ResPlaylistDto })
  @Get('/find/:id')
  find(
    @ReqUser('sub') userId: string,
    @Param('id') id: string,
  ): Promise<Playlist> {
    return this.playlistsService.find(userId, id);
  }

  @ApiOkResponse({ type: [ResPlaylistDto] })
  @Get('/list/:page')
  listPage(
    @ReqUser('sub') userId: string,
    @Param('page') page: number,
  ): Promise<Array<Playlist>> {
    return this.playlistsService.listPage(userId, page);
  }

  @ApiOkResponse({
    type: ActivatePlaylistDto,
    description: 'The playlist is now active.',
  })
  @Patch('/active/:id')
  activate(
    @ReqUser('sub') userId: string,
    @Param('id') id: string,
    @Body() activatePlaylistDto: ActivatePlaylistDto,
  ): Promise<Playlist> {
    return this.playlistsService.activate(userId, id, activatePlaylistDto);
  }

  @Patch('/allowUsers/:id')
  updateAllowedUsers(
    @ReqUser('sub') userId: string,
    @Param('id') id: string,
    @Body() updateAllowedUsersDto: UpdateAllowedUsersDto,
  ): Promise<Playlist> {
    return this.playlistsService.updateAllowedUsers(
      userId,
      id,
      updateAllowedUsersDto,
    );
  }

  @Delete('/delete/:id')
  @HttpCode(204)
  delete(
    @ReqUser('sub') userId: string,
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<void> {
    return this.playlistsService.delete(userId, id, res);
  }

  @ApiOperation({
    summary:
      'Authenticated route to be accessed by external apps with its CLIENT_KEY as Bearer token.',
  })
  @ApiQuery({
    name: 'CLIENT_ID',
    type: String,
    description: 'The CLIEND ID of a registered external app',
  })
  @ApiOkResponse({ type: ResActivePlaylistDto })
  @Public()
  @UseGuards(ExternalAppGuard)
  @Get('findAll/active')
  async findAllActive() {
    return this.playlistsService.findAllActive();
  }

  @ApiOperation({
    summary:
      'Authenticated route to be accessed by external apps with its CLIENT_KEY as Bearer token.',
  })
  @ApiQuery({
    name: 'CLIENT_ID',
    type: String,
    description: 'The CLIEND ID of a registered external app',
  })
  @Public()
  @UseGuards(ExternalAppGuard)
  @Patch('/update/:id')
  update(
    @Param('id') id: string,
    @Body() updatePlaylistDto: UpdatePlaylistDto,
  ): Promise<Playlist> {
    return this.playlistsService.update(id, updatePlaylistDto);
  }
}
