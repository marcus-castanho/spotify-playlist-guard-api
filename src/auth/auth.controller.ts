import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SpotifyOauthGuard } from './guards/spotify-oauth.guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  @UseGuards(SpotifyOauthGuard)
  login() {
    return;
  }

  @Get('redirect')
  @UseGuards(SpotifyOauthGuard)
  async spotifyAuthRedirect(@Req() req: any) {
    const { user, authInfo } = req;

    const authUser = await this.authService
      .validateUser(user, {
        ...authInfo,
      })
      .then((user) => {
        req.user = undefined;
        req.authInfo = undefined;
        return user;
      });

    return authUser;
  }
}
