import { ArrayMinSize, IsArray, IsOptional } from 'class-validator';

export class UpdateAllowedUsersDto {
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  allowed_userIds: string[];
}
