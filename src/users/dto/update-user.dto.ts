import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  display_name: string;

  @IsOptional()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  image: string;

  @IsOptional()
  @IsString()
  country: string;

  @IsOptional()
  @IsString()
  external_url: string;

  @IsOptional()
  @IsString()
  href: string;

  @IsOptional()
  @IsString()
  uri: string;
}
