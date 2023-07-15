import {
  ArrayMinSize,
  IsArray,
  IsDate,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  country: string;

  @IsString()
  display_name: string;

  @IsString()
  email: string;

  @IsString()
  external_url: string;

  @IsNumber()
  followers: number;

  @IsString()
  href: string;

  @IsString()
  spotify_id: string;

  @IsArray()
  @ArrayMinSize(1)
  images: string[];

  @IsString()
  product: string;

  @IsString()
  type: string;

  @IsString()
  uri: string;

  @IsString()
  refreshToken: string;

  @IsString()
  accessToken: string;

  @IsDate()
  expiresAt: Date;
}
