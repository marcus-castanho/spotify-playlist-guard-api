import { IsString } from 'class-validator';

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

  @IsString()
  external_url: string;

  @IsString()
  href: string;

  @IsString()
  uri: string;

  @IsString()
  refresh_token: string;
}
