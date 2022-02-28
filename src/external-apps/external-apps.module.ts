import { Module } from '@nestjs/common';
import { ExternalAppsService } from './external-apps.service';
import { ExternalAppsController } from './external-apps.controller';

@Module({
  controllers: [ExternalAppsController],
  providers: [ExternalAppsService],
})
export class ExternalAppsModule {}
