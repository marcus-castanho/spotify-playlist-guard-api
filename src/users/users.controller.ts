import {
  Controller,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Res,
  HttpCode,
  ForbiddenException,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ResUserDto } from './dto/reponse-user.dto';
import { ReqUser } from 'src/auth/decorators/user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/@types/role.enum';
import { User as QueryUser } from 'src/spotify-scrapping/entities/user.entity';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOkResponse({ type: ResUserDto })
  @Get('/find/:id')
  find(@ReqUser('sub') userId: string, @Param('id') id: string): Promise<User> {
    if (userId !== id) throw new ForbiddenException();

    return this.usersService.find(id);
  }

  @ApiOkResponse({ type: ResUserDto })
  @Patch('/update/:id')
  update(
    @ReqUser('sub') userId: string,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    if (userId !== id) throw new ForbiddenException();

    return this.usersService.update(id, updateUserDto);
  }

  @Delete('/delete/:id')
  @HttpCode(204)
  delete(
    @ReqUser('sub') userId: string,
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<void> {
    if (userId !== id) throw new ForbiddenException();

    return this.usersService.delete(id, res);
  }

  @ApiOkResponse({ type: ResUserDto })
  @Get('/me')
  me(@ReqUser('sub') userId: string): Promise<User> {
    return this.usersService.find(userId);
  }

  @Get('/query')
  query(@Query('identifier') identifier: string): Promise<QueryUser[]> {
    return this.usersService.query(identifier);
  }

  @Get('/profile/:id')
  findProfile(@Param('id') id: string): Promise<User> {
    return this.usersService.findProfile(id);
  }

  @ApiOkResponse({ type: ResUserDto })
  @Roles(Role.Admin)
  @Get('protected/find/:id')
  protectedFind(@Param('id') id: string): Promise<User> {
    return this.usersService.find(id);
  }

  @ApiOkResponse({ type: [ResUserDto] })
  @Roles(Role.Admin)
  @Get('protected/list/:page')
  protectedListPage(@Param('page') page: number): Promise<Array<User>> {
    return this.usersService.listPage(page);
  }

  @ApiOkResponse({ type: ResUserDto })
  @Roles(Role.Admin)
  @Patch('protected/update/:id')
  protectedUpdate(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete('protected/delete/:id')
  @Roles(Role.Admin)
  @HttpCode(204)
  protectedDelete(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<void> {
    return this.usersService.delete(id, res);
  }
}
