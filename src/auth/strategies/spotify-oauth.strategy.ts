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
    private readonly configService: ConfigService,
  ) {
    super(
      {
        clientID: process.env.SPOTIFY_CLIENT_ID, //configService.get<string>('SPOTIFY_CLIENT_ID'),
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET, //configService.get<string>('SPOTIFY_CLIENT_SECRET'),
        callbackURL: process.env.CALLBACK_URL, //configService.get<string>('CALLBACK_URL'),
        scope:
          'user-read-private user-read-email playlist-modify-private playlist-read-collaborative playlist-read-private playlist-modify-public',
      },
      (
        accessToken: string,
        refreshToken: string,
        expires_in: number,
        profile: Profile,
        done: VerifyCallback,
      ) => {
        return done(null, profile, {
          accessToken,
          refreshToken,
          expires_in,
        });
      },
    );
  }
}
