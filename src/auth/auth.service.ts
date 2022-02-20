import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Profile } from 'passport-spotify';
import { JwtPayload } from 'src/@types/jwt';
import { AuthInfo, ProfileJson } from 'src/@types/passport-spotify';
import { User } from 'src/users/entity/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  login(user: Partial<User>) {
    const payload: JwtPayload = {
      username: user.display_name,
      sub: user.id,
    };

    return this.jwtService.sign(payload);
  }

  async validateUser(profile: Profile, info: AuthInfo): Promise<Partial<User>> {
    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      explicit_content,
      external_urls,
      followers,
      images,
      ...profileJson
    } = profile._json as ProfileJson;

    const imagesUrl = images.map((object) => object.url);

    const userData = {
      external_url: external_urls.spotify,
      followers: followers.total,
      images: imagesUrl,
      ...profileJson,
      ...info,
    };

    return this.userService.createIfNotExists({
      ...userData,
    });
  }
}
