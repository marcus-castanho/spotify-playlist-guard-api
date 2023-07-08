import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-spotify';
import { validateOAuthData } from '../validations/oAuth';
import { UnauthorizedException } from '@nestjs/common';

export class SpotifyOauthStrategy extends PassportStrategy(
  Strategy,
  'spotify',
) {
  constructor() {
    super(
      {
        clientID: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL,
        scope:
          'user-read-private user-read-email playlist-modify-private playlist-read-collaborative playlist-read-private playlist-modify-public',
      },
      (
        accessToken: string,
        refreshToken: string,
        expires_in: number,
        profile: Profile,
        done: VerifyCallback,
      ): void => {
        const userData = validateOAuthData(profile);

        if (!userData) throw new UnauthorizedException();

        return done(null, profile, { accessToken, refreshToken, expires_in });
      },
    );
  }
}
