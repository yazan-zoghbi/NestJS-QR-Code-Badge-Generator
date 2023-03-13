import { CustomerData } from '../customer-data.interface';
import { GenerateQRDataService } from 'src/shared/generate-data/generate-qr-data.service';
import { QRTypeEnum } from '../qr-type.enum';

export class CreateQrDto {
  readonly customerData: CustomerData;
  readonly customer_id: string;
  readonly type: QRTypeEnum;

  constructor(private readonly generateQRDataService: GenerateQRDataService) {}
  get data(): string {
    return this.generateQRDataService.generate(
      this.type,
      this.customerData,
      this.customer_id,
    );
  }
}
