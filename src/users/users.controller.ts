import {
  Controller,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entity/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/find/:id')
  find(@Param('id') id: string): Promise<User> {
    return this.usersService.find(id);
  }

  @Get('/list/:page')
  listPage(@Param('page') page: number): Promise<Array<Partial<User>>> {
    return this.usersService.listPage(page);
  }

  @Patch('/update/:id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<Partial<User>> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete('/delete/:id')
  delete(@Param('id') id: string, @Res() res: Response): Promise<void> {
    return this.usersService.delete(id, res);
  }
}
