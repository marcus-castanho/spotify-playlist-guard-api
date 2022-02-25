import { Module } from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { PlaylistsController } from './playlists.controller';
import { UsersModule } from 'src/users/users.module';
import { SpotifyModule } from 'src/spotify/spotify.module';

@Module({
  imports: [UsersModule, SpotifyModule],
  controllers: [PlaylistsController],
  providers: [PlaylistsService],
})
export class PlaylistsModule {}
