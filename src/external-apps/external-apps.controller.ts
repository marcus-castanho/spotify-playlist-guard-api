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
import { Public } from 'src/auth/decorators/public.decorator';
import { Response } from 'express';

@Controller('external-apps')
export class ExternalAppsController {
  constructor(private readonly externalAppsService: ExternalAppsService) {}

  @Public()
  @Post('add')
  async create(
    @Body() createExternalAppDto: CreateExternalAppDto,
  ): Promise<Partial<ExternalApp>> {
    return this.externalAppsService.create(createExternalAppDto);
  }

  @Public()
  @Get('find/:id')
  async findOne(@Param('id') id: string): Promise<Partial<ExternalApp>> {
    return this.externalAppsService.findOne(id);
  }

  @Public()
  @Get('list/:page')
  listPage(@Param('page') page: number): Promise<Partial<ExternalApp[]>> {
    return this.externalAppsService.listPage(page);
  }

  @Public()
  @Patch('update/:id')
  async update(
    @Param('id') id: string,
    @Body() updateExternalAppDto: UpdateExternalAppDto,
  ) {
    return this.externalAppsService.update(id, updateExternalAppDto);
  }

  @Public()
  @Delete('delete/:id')
  remove(@Param('id') id: string, @Res() res: Response): Promise<void> {
    return this.externalAppsService.remove(id, res);
  }
}
