import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Profile } from 'passport-spotify';
import { JwtPayload } from 'src/@types/jwt';
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

  login(user: User | AdminUser) {
    const name = user instanceof User ? user.display_name : user.name;
    const payload: JwtPayload = {
      name,
      sub: user.id,
    };

    return this.jwtService.sign(payload);
  }

  async validateAdminUser(
    email: string,
    inputPassword: string,
  ): Promise<Partial<AdminUser>> {
    const adminUser = await this.adminUserSerivce.findOneByEmail(email);
    const validatePassword = bcrypt.compareSync(
      inputPassword,
      adminUser.password,
    );

    if (adminUser && validatePassword) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userData } = adminUser;

      return userData;
    }

    return null;
  }

  async validateUser(profile: Profile, info: AuthInfo): Promise<Partial<User>> {
    const { accessToken, refreshToken, expires_in } = info;
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + expires_in);

    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      explicit_content,
      external_urls,
      followers,
      images,
      ...profileJson
    } = profile._json as ProfileJson;

    const imagesUrl = images.map((object) => object.url);

    const userData: CreateUserDto = {
      external_url: external_urls.spotify,
      followers: followers.total,
      images: imagesUrl,
      accessToken,
      refreshToken,
      expiresAt,
      ...profileJson,
    };

    return this.userService.createIfNotExists({
      ...userData,
    });
  }
}
