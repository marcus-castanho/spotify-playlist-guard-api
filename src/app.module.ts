import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, UsersModule, ConfigModule.forRoot()],
  controllers: [],
  providers: [],
})
export class AppModule {}
