import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { PlaylistsModule } from './playlists/playlists.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, UsersModule, PlaylistsModule, ConfigModule.forRoot(), AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
