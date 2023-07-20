import { Module } from '@nestjs/common';
import { SpotifyScrappingService } from './spotify-scrapping.service';

@Module({
  providers: [SpotifyScrappingService],
  exports: [SpotifyScrappingService],
})
export class SpotifyScrappingModule {}
