import { PartialType } from '@nestjs/swagger';
import { IsDate } from 'class-validator';
import { Playlist } from '../entities/playlist.entity';

export class ResPlaylistDto extends PartialType(Playlist) {
  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
