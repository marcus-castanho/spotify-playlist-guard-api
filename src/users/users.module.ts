import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SpotifyModule } from 'src/spotify/spotify.module';
import { EncryptionModule } from 'src/encryption/encryption.module';

@Module({
  imports: [SpotifyModule, EncryptionModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
