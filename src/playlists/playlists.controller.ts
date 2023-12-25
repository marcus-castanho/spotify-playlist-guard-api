import {
  Controller,
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
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { ResPlaylistDto } from './dto/response-playlist.dto';
import { ResActivePlaylistDto } from './dto/response-active-playlist.dto';
import { ResPaginatedPlaylistDto } from './dto/response-paginated-playlist.dto';

@ApiTags('Playlists')
@Controller('playlists')
export class PlaylistsController {
  constructor(private readonly playlistsService: PlaylistsService) {}

  @ApiBearerAuth()
  @ApiOkResponse({ type: ResPlaylistDto })
  @Get('/find/:id')
  find(
    @ReqUser('sub') userId: string,
    @Param('id') id: string,
  ): Promise<Playlist> {
    return this.playlistsService.find(userId, id);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: ResPaginatedPlaylistDto })
  @Get('/list/:page')
  async listPage(
    @ReqUser('sub') userId: string,
    @Param('page') page: number,
  ): Promise<{ pages: number; items: Playlist[] }> {
    const pages = await this.playlistsService.countPages(5);
    const items = await this.playlistsService.listPage(userId, page);

    return {
      pages,
      items,
    };
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The playlist is now active/inactive.',
  })
  @Patch('/active/:id')
  @HttpCode(204)
  activate(
    @ReqUser('sub') userId: string,
    @Param('id') id: string,
    @Body() activatePlaylistDto: ActivatePlaylistDto,
  ): Promise<void> {
    return this.playlistsService.activate(userId, id, activatePlaylistDto);
  }

  @ApiBearerAuth()
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

  @ApiBearerAuth()
  @Delete('/delete/:id')
  @HttpCode(204)
  delete(
    @ReqUser('sub') userId: string,
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<void> {
    return this.playlistsService.delete(userId, id, res);
  }

  @ApiSecurity('api_key', ['api_key'])
  @ApiOperation({
    summary:
      'Authenticated route to be accessed by external apps with its client API Key.',
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

  @ApiSecurity('api_key', ['api_key'])
  @ApiOperation({
    summary:
      'Authenticated route to be accessed by external apps with its client API Key.',
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
