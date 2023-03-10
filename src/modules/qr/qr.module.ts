import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QrController } from './qr.controller';
import { QrService } from './qr.service';
import { QrRepository } from './qr.repository';
import { QrBadge, QrCodeSchema } from './schemas/qr.schema';
import { QrStats, QrStatsSchema } from './schemas/qr.stats.schema';
import { QrType, QrTypeSchema } from './schemas/qr.type.schema';
import { Customer, CustomerSchema } from '../customer/schema/customer.schema';
import { QrTypeService } from './qr.type.service';
import { CustomerModule } from '../customer/customer.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: QrBadge.name, schema: QrCodeSchema },
      { name: QrStats.name, schema: QrStatsSchema },
      { name: QrType.name, schema: QrTypeSchema },
      { name: Customer.name, schema: CustomerSchema },
    ]), CustomerModule
  ],
  controllers: [QrController],
  providers: [QrService, QrRepository, QrTypeService],
})
export class QrModule {}
