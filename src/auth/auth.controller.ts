import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { SpotifyOauthGuard } from './guards/spotify-oauth.guard';
import { Profile } from 'passport-spotify';
import { AuthInfo } from 'src/@types/passport-spotify';
import { SpotifyOauthStrategy } from './strategies/spotify-oauth.strategy';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly spotifyOauthStrategy: SpotifyOauthStrategy,
  ) {}

  @Public()
  @UseGuards(SpotifyOauthGuard)
  @Get('login')
  login(): void {
    return;
  }

  @Public()
  @UseGuards(SpotifyOauthGuard)
  @Get('redirect')
  async spotifyAuthRedirect(
    @Req() req: any,
    @Res() res: Response,
  ): Promise<Response> {
    const { user, authInfo }: { user: Profile; authInfo: AuthInfo } = req;

    if (!user) {
      res.redirect('/');
      return;
    }

    const authUser = await this.authService
      .validateUser(user, {
        ...authInfo,
      })
      .then((user) => {
        req.user = undefined;
        req.authInfo = undefined;
        return user;
      });

    const jwt = this.authService.login(authUser);

    res.set('authorization', `Bearer ${jwt}`);

    return res.status(201).json(authUser);
  }
}
