import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { SpotifyOauthGuard } from './guards/spotify-oauth.guard';
import { Profile } from 'passport-spotify';
import { AuthInfo } from 'src/@types/passport-spotify';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ResUserDto } from 'src/users/dto/reponse-user.dto';
import { ResAdminUserDto } from 'src/admin-users/dto/response-admin-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary:
      'Public route to be accesed and redirect user to the Spotify login page for OAuth2 validation.',
  })
  @Public()
  @UseGuards(SpotifyOauthGuard)
  @Get('login')
  login(): void {
    return;
  }

  @ApiOperation({
    summary: 'Public route to authenticate admin users.',
  })
  @ApiCreatedResponse({ type: ResAdminUserDto })
  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('login/admin')
  loginAdmin(@Req() req: any, @Res() res: Response): Response {
    const adminUser = req.user;
    const jwt = this.authService.login(adminUser);

    res.set('authorization', `Bearer ${jwt}`);

    return res.status(201).json(adminUser);
  }

  @ApiOperation({
    summary:
      "Public route to be accessed by the Spotify OAuth2 redirection step carying the user's Bearer Token.",
  })
  @ApiOkResponse({ type: ResUserDto })
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
