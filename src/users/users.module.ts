import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersPostgresRepository } from './repository/implementation/UserPostgresRepository';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
