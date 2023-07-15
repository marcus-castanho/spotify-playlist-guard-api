import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdatePlaylistDto {
  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  external_url: string;

  @IsOptional()
  @IsNumber()
  followers: number;

  @IsOptional()
  @IsString()
  href: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  snapshot_id: string;

  @IsOptional()
  @IsArray()
  tracks: string[];

  @IsOptional()
  @IsString()
  uri: string;
}
