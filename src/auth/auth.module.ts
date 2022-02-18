import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SpotifyOauthStrategy } from './strategies/spotify-oauth.strategy';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'spotify' }),
  ],
  providers: [AuthService, SpotifyOauthStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
