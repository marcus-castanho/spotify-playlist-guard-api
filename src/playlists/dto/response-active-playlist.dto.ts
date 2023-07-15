import { OmitType } from '@nestjs/swagger';
import { ResUserTokensDto } from 'src/users/dto/reponse-user-tokens.dto';
import { ResPlaylistDto } from './response-playlist.dto';

export class ResActivePlaylistDto extends OmitType(ResPlaylistDto, [
  'userId',
] as const) {
  owner: ResUserTokensDto;
}
