import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule, ConfigModule.forRoot()],
  controllers: [],
  providers: [],
})
export class AppModule {}
