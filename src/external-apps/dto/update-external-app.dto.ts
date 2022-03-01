import { PartialType } from '@nestjs/mapped-types';
import { CreateExternalAppDto } from './create-external-app.dto';

export class UpdateExternalAppDto extends PartialType(CreateExternalAppDto) {}
