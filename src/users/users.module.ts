import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SpotifyModule } from 'src/spotify/spotify.module';
import { PlaylistsModule } from 'src/playlists/playlists.module';

@Module({
  imports: [SpotifyModule, PlaylistsModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
