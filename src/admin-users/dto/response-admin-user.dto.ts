import { OmitType, PartialType } from '@nestjs/swagger';
import { AdminUser } from '../entities/admin-user.entity';

export class ResAdminUserDto extends PartialType(
  OmitType(AdminUser, ['password'] as const),
) {}
