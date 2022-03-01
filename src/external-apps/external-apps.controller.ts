import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { ExternalAppsService } from './external-apps.service';
import { CreateExternalAppDto } from './dto/create-external-app.dto';
import { UpdateExternalAppDto } from './dto/update-external-app.dto';
import { ExternalApp } from './entities/external-app.entity';
import { Response } from 'express';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/@types/role.enum';

@Controller('external-apps')
export class ExternalAppsController {
  constructor(private readonly externalAppsService: ExternalAppsService) {}

  @Roles(Role.Admin)
  @Post('add')
  async create(
    @Body() createExternalAppDto: CreateExternalAppDto,
  ): Promise<Partial<ExternalApp>> {
    return this.externalAppsService.create(createExternalAppDto);
  }

  @Roles(Role.Admin)
  @Get('find/:id')
  async findOne(@Param('id') id: string): Promise<Partial<ExternalApp>> {
    return this.externalAppsService.findOne(id);
  }

  @Roles(Role.Admin)
  @Get('list/:page')
  listPage(@Param('page') page: number): Promise<Partial<ExternalApp[]>> {
    return this.externalAppsService.listPage(page);
  }

  @Roles(Role.Admin)
  @Patch('update/:id')
  async update(
    @Param('id') id: string,
    @Body() updateExternalAppDto: UpdateExternalAppDto,
  ) {
    return this.externalAppsService.update(id, updateExternalAppDto);
  }

  @Roles(Role.Admin)
  @Delete('delete/:id')
  remove(@Param('id') id: string, @Res() res: Response): Promise<void> {
    return this.externalAppsService.remove(id, res);
  }
}
