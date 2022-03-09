import { IsBoolean } from 'class-validator';

export class ActivatePlaylistDto {
  @IsBoolean()
  active: boolean;
}
