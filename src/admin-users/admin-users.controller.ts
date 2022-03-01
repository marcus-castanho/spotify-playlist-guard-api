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
import { Response } from 'express';
import { Role } from 'src/@types/role.enum';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AdminUsersService } from './admin-users.service';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto';
import { AdminUser } from './entities/admin-user.entity';

@Controller('admin-users')
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  @Public()
  @Post('create/:adminKey')
  async create(
    @Param('adminKey') adminKey: string,
    @Body() createAdminUserDto: CreateAdminUserDto,
  ): Promise<AdminUser> {
    return this.adminUsersService.create(adminKey, createAdminUserDto);
  }

  @Roles(Role.Admin)
  @Get('list/:page')
  async listPage(@Param('page') page: number): Promise<AdminUser[]> {
    return this.adminUsersService.listPage(page);
  }

  @Roles(Role.Admin)
  @Get('find/:id')
  findOne(@Param('id') id: string) {
    return this.adminUsersService.findOne(id);
  }

  @Roles(Role.Admin)
  @Patch('update/:id')
  async update(
    @Param('id') id: string,
    @Body() updateAdminUserDto: UpdateAdminUserDto,
  ) {
    return this.adminUsersService.update(id, updateAdminUserDto);
  }

  @Roles(Role.Admin)
  @Delete('delete/:id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    return this.adminUsersService.remove(id, res);
  }
}
