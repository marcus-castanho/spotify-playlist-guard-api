import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { PlaylistsModule } from './playlists/playlists.module';
import { AuthModule } from './auth/auth.module';
import { ExternalAppsModule } from './external-apps/external-apps.module';
import { AdminUsersModule } from './admin-users/admin-users.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    PlaylistsModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ExternalAppsModule,
    AdminUsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
