import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpCode,
} from '@nestjs/common';
import { ExternalAppsService } from './external-apps.service';
import { CreateExternalAppDto } from './dto/create-external-app.dto';
import { UpdateExternalAppDto } from './dto/update-external-app.dto';
import { ExternalApp } from './entities/external-app.entity';
import { Response } from 'express';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/@types/role.enum';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ResExternalAppDto } from './dto/response-external-app.dto';

@ApiTags('External Apps')
@ApiBearerAuth()
@Controller('external-apps')
export class ExternalAppsController {
  constructor(private readonly externalAppsService: ExternalAppsService) {}

  @Roles(Role.Admin)
  @Post('add')
  async create(
    @Body() createExternalAppDto: CreateExternalAppDto,
  ): Promise<ExternalApp> {
    return this.externalAppsService.create(createExternalAppDto);
  }

  @Roles(Role.Admin)
  @Get('find/:id')
  async findOne(@Param('id') id: string): Promise<ExternalApp> {
    return this.externalAppsService.findOne(id);
  }

  @ApiOkResponse({ type: ResExternalAppDto })
  @Roles(Role.Admin)
  @Get('list/:page')
  async listPage(
    @Param('page') page: number,
  ): Promise<{ pages: number; items: ExternalApp[] }> {
    const pages = await this.externalAppsService.countPages(15);
    const items = await this.externalAppsService.listPage(page);
    return {
      pages,
      items,
    };
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
  @HttpCode(204)
  remove(@Param('id') id: string, @Res() res: Response): Promise<void> {
    return this.externalAppsService.remove(id, res);
  }
}
