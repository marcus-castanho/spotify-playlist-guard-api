import { OmitType, PartialType } from '@nestjs/swagger';
import { IsArray, IsOptional } from 'class-validator';
import { Playlist } from 'src/playlists/entities/playlist.entity';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['id'] as const),
) {
  @IsOptional()
  @IsArray()
  playlists?: Playlist[];
}
