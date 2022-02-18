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
  googleAuthRedirect(@Req() req: any) {
    console.log(Object.keys(req));
    return req.user;
  }
}
