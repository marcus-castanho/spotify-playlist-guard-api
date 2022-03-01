import { Module } from '@nestjs/common';
import { ExternalAppsService } from './external-apps.service';
import { ExternalAppsController } from './external-apps.controller';
import { EncryptionModule } from 'src/encryption/encryption.module';

@Module({
  imports: [EncryptionModule],
  controllers: [ExternalAppsController],
  providers: [ExternalAppsService],
})
export class ExternalAppsModule {}
