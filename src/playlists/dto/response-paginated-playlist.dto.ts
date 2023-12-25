import { Playlist } from '../entities/playlist.entity';

export class ResPaginatedPlaylistDto {
  pages: number;
  items: Playlist[];
}
