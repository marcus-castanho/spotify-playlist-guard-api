import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { PlaylistsModule } from './playlists/playlists.module';
import { AuthModule } from './auth/auth.module';
import { ExternalAppsModule } from './external-apps/external-apps.module';
import { AdminUsersModule } from './admin-users/admin-users.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { EncryptionModule } from './encryption/encryption.module';

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
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
