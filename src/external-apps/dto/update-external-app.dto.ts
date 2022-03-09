import { PartialType } from '@nestjs/swagger';
import { CreateExternalAppDto } from './create-external-app.dto';

export class UpdateExternalAppDto extends PartialType(CreateExternalAppDto) {}
