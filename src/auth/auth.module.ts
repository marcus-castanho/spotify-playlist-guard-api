import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { SpotifyOauthStrategy } from './strategies/spotify-oauth.strategy';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  providers: [AuthService, SpotifyOauthStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
