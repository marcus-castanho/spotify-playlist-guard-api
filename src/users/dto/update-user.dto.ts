import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { Playlist } from 'src/playlists/entities/playlist.entity';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['id'] as const),
) {
  @IsOptional()
  @IsString()
  ivAccessToken?: string;

  @IsOptional()
  @IsString()
  ivRefreshToken?: string;

  @IsOptional()
  @IsArray()
  playlists?: Playlist[];
}
