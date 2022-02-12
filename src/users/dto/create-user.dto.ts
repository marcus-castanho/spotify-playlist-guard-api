import { Playlist } from '@prisma/client';
import { ArrayMaxSize, IsArray, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  id: string;

  @IsString()
  display_name: string;

  @IsString()
  email: string;

  @IsString()
  image: string;

  @IsString()
  country: string;

  @IsArray()
  @ArrayMaxSize(0)
  playlists: Array<Playlist>;

  @IsString()
  external_url: string;

  @IsString()
  href: string;

  @IsString()
  uri: string;

  @IsString()
  refresh_token: string;
}
