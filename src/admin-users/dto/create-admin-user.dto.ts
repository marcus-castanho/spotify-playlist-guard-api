import { IsEnum, IsString } from 'class-validator';
import { Role } from 'src/@types/role.enum';

export class CreateAdminUserDto {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsEnum(Role, { each: true })
  roles: Role[];
}
