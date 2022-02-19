import { Injectable } from '@nestjs/common';
import { Profile } from 'passport-spotify';
import { AuthInfo, ProfileJson } from 'src/@types/passport-spotify';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  async validateUser(profile: Profile, info: AuthInfo) {
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
