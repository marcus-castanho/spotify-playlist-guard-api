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

// provider: string;
// id: string;
// username: string;
// displayName: string;
// profileUrl: string | null;
// photos: [string] | null;
// country: string;
// followers: number | null;
// product: string | null;
// emails?: [{ value: string; type: null }] | undefined;
// _raw: string;
// _json: any;
