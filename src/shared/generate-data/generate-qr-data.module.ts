import { Module } from '@nestjs/common';
import { GenerateQRDataService } from './generate-qr-data.service';

@Module({
  providers: [GenerateQRDataService],
  exports: [GenerateQRDataService],
})
export class GenerateQRDataModule {}
