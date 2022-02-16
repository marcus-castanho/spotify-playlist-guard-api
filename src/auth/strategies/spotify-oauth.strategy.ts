import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-spotify';
import { AuthService } from '../auth.service';

export class SpotifyOauthStrategy extends PassportStrategy(
  Strategy,
  'spotify',
) {
  constructor(
    private readonly authService: AuthService,
    configService: ConfigService,
  ) {
    super({
      clientID: configService.get('SPOTIFY_CLIENT_ID'),
      clientSecret: configService.get('SPOTIFY_CLIENT_SECRET'),
      callbackURL: configService.get('CALLBACK_URL'),
      scope:
        'user-read-private user-read-email playlist-modify-private playlist-read-collaborative playlist-read-private playlist-modify-public',
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    expires_in: number,
    profile: Profile,
    done: VerifyCallback,
  ) {
    const user = this.authService.validateUser(
      accessToken,
      refreshToken,
      expires_in,
      profile,
    );

    if (!user) throw new UnauthorizedException();

    return user;
  }
}
