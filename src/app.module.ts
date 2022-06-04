import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { PlaylistsModule } from './playlists/playlists.module';
import { AuthModule } from './auth/auth.module';
import { ExternalAppsModule } from './external-apps/external-apps.module';
import { AdminUsersModule } from './admin-users/admin-users.module';
import { EncryptionModule } from './encryption/encryption.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    PlaylistsModule,
    AuthModule,
    ExternalAppsModule,
    AdminUsersModule,
    EncryptionModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
