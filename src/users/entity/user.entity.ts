import { Playlist } from 'src/playlists/entities/playlist.entity';

export class User {
  spotify_id?: string;
  country?: string;
  display_name?: string;
  email?: string;
  external_url?: string;
  followers?: number;
  href?: string;
  id?: string;
  images?: string[];
  product?: string;
  type?: string;
  uri?: string;
  playlists?: Playlist[];
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
}
