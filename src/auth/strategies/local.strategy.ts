import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { validateAdminUserData } from '../validations/local-jwt';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    const adminUser = await this.authService.validateAdminUser(email, password);
    const adminUserData = validateAdminUserData(adminUser);

    if (!adminUserData) throw new UnauthorizedException();

    return adminUserData;
  }
}
