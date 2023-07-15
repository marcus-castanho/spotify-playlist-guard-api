import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Profile } from 'passport-spotify';
import { JwtPayloadAdmin, JwtPayloadUser } from 'src/@types/jwt';
import { AuthInfo, ProfileJson } from 'src/@types/passport-spotify';
import { AdminUsersService } from 'src/admin-users/admin-users.service';
import { AdminUser } from 'src/admin-users/entities/admin-user.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entity/user.entity';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly adminUserSerivce: AdminUsersService,
  ) {}

  loginUser(user: User) {
    const payload: Omit<JwtPayloadUser, 'iat' | 'exp'> = {
      sub: user.id as string,
    };

    return this.jwtService.sign(payload);
  }

  loginAdminUser(user: Required<AdminUser>) {
    const { name, roles } = user;

    const payload: Omit<JwtPayloadAdmin, 'iat' | 'exp'> = {
      name,
      sub: user.id,
      roles,
    };

    return this.jwtService.sign(payload);
  }

  async validateAdminUser(
    email: string,
    inputPassword: string,
  ): Promise<AdminUser | null> {
    const adminUser = await this.adminUserSerivce.findOneByEmail(email);
    const validatePassword = bcrypt.compareSync(
      inputPassword,
      adminUser.password as string,
    );

    if (adminUser && validatePassword) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userData } = adminUser;

      return userData;
    }

    return null;
  }

  async validateUser(profile: Profile, info: AuthInfo): Promise<User> {
    const { accessToken, refreshToken, expires_in } = info;
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + expires_in);

    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      explicit_content,
      external_urls,
      followers,
      images,
      ['id']: spotify_id,
      ...profileJson
    } = profile._json as ProfileJson;

    const imagesUrl = images.map((object) => object.url);

    const userData: CreateUserDto = {
      spotify_id,
      external_url: external_urls.spotify,
      followers: followers.total,
      images: imagesUrl,
      accessToken,
      refreshToken,
      expiresAt,
      ...profileJson,
    };

    return this.userService.upsertUserData({
      ...userData,
    });
  }
}
