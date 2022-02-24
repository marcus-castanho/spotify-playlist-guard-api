import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['id'] as const),
) {
  @IsOptional()
  @IsString()
  ivAccessToken?: string;

  @IsOptional()
  @IsString()
  ivRefreshToken?: string;
}
