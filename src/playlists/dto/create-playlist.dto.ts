import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreatePlaylistDto {
  @IsString()
  id: string;

  @IsBoolean()
  collaborative: boolean;

  @IsString()
  description: string;

  @IsString()
  external_url: string;

  @IsNumber()
  followers: number;

  @IsString()
  href: string;

  @IsString()
  name: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsBoolean()
  public: boolean;

  @IsString()
  snapshot_id: string;

  @IsArray()
  tracks: string[];

  @IsString()
  uri: string;

  @IsBoolean()
  active: boolean;

  @IsArray()
  @ArrayMinSize(1)
  allowed_userIds: string[];
}
