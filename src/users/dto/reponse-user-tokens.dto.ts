import { OmitType, PartialType } from '@nestjs/swagger';
import { IsDate } from 'class-validator';
import { User } from '../entity/user.entity';

export class ResUserTokensDto extends PartialType(
  OmitType(User, ['playlists'] as const),
) {
  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
