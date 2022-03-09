import {
  Controller,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Res,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entity/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ResUserDto } from './dto/reponse-user.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOkResponse({ type: ResUserDto })
  @Get('/find/:id')
  find(@Param('id') id: string): Promise<User> {
    return this.usersService.find(id);
  }

  @ApiOkResponse({ type: [ResUserDto] })
  @Get('/list/:page')
  listPage(@Param('page') page: number): Promise<Array<User>> {
    return this.usersService.listPage(page);
  }

  @ApiOkResponse({ type: ResUserDto })
  @Patch('/update/:id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete('/delete/:id')
  @HttpCode(204)
  delete(@Param('id') id: string, @Res() res: Response): Promise<void> {
    return this.usersService.delete(id, res);
  }
}
