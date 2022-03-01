import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import { AdminUsersService } from './admin-users.service';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto';

@Controller('admin-users')
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  @Public()
  @Post('create/:adminKey')
  async create(
    @Param('adminKey') adminKey: string,
    @Body() createAdminUserDto: CreateAdminUserDto,
  ) {
    return this.adminUsersService.create(adminKey, createAdminUserDto);
  }

  // @Get()
  // findAll() {
  //   return this.adminUsersService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.adminUsersService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateAdminUserDto: UpdateAdminUserDto,
  // ) {
  //   return this.adminUsersService.update(+id, updateAdminUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.adminUsersService.remove(+id);
  // }
}
