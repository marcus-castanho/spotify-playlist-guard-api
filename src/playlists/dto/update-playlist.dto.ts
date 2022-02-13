import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdatePlaylistDto {
  @IsOptional()
  @IsBoolean()
  collaborative: boolean;

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
  @IsBoolean()
  public: boolean;

  @IsOptional()
  @IsString()
  snapshot_id: string;

  @IsOptional()
  @IsArray()
  tracks: string[];

  @IsOptional()
  @IsString()
  uri: string;

  @IsOptional()
  @IsBoolean()
  active: boolean;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  allowed_userIds: string[];
}
