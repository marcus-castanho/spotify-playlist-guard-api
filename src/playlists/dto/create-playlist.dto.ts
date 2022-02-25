import { ArrayMinSize, IsArray, IsBoolean, IsString } from 'class-validator';

export class CreatePlaylistDto {
  @IsString()
  id: string;

  @IsBoolean()
  active: boolean;

  @IsArray()
  @ArrayMinSize(1)
  allowed_userIds: string[];

  @IsString()
  userId: string;
}
