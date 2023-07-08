import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from 'src/@types/jwt';
import {
  validateAdminJwtPayload,
  validateUserJwtPayload,
} from '../validations/jwt';
import { UnauthorizedException } from '@nestjs/common';

export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: unknown): Promise<JwtPayload> {
    const adminJwtPayload = validateAdminJwtPayload(payload);
    const userJwtPayload = validateUserJwtPayload(payload);

    if (!adminJwtPayload && !userJwtPayload)
      throw new UnauthorizedException('JWT Malformed');
    if (!userJwtPayload) throw new UnauthorizedException('JWT Malformed');

    return adminJwtPayload || userJwtPayload;
  }
}
