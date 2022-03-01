import { IsString } from 'class-validator';

export class CreateExternalAppDto {
  @IsString()
  name: string;

  @IsString()
  recoverEmail: string;

  @IsString()
  baseUrl: string;
}
