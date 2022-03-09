import { OmitType, PartialType } from '@nestjs/swagger';
import { ExternalApp } from '../entities/external-app.entity';

export class ResExternalAppDto extends PartialType(
  OmitType(ExternalApp, ['apiKey'] as const),
) {}
