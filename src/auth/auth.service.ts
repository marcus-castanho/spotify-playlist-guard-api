import { Injectable } from '@nestjs/common';
import { Profile } from 'passport-spotify';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  async validateUser(
    accessToken: string,
    refreshToken: string,
    expires_in: number,
    profile: Profile,
  ) {
    const user = await this.userService.find(profile.id);

    if (user) return user;
    else {
      return this.userService.create(...profile);
    }
  }
}
