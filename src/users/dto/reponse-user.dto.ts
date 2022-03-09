import { OmitType, PartialType } from '@nestjs/swagger';
import { IsDate } from 'class-validator';
import { User } from '../entity/user.entity';

export class ResUserDto extends PartialType(
  OmitType(User, [
    'playlists',
    'accessToken',
    'refreshToken',
    'expiresAt',
  ] as const),
) {
  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
