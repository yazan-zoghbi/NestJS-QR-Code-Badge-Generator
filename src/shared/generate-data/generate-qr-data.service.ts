import { Injectable } from '@nestjs/common';
import {
  CustomerData,
  VCardData,
} from 'src/modules/qr/customer-data.interface';
import { QRTypeEnum } from 'src/modules/qr/qr-type.enum';

@Injectable()
export class GenerateQRDataService {
  generate(
    qrType: QRTypeEnum,
    customerData: CustomerData | VCardData,
    customer_id: string,
  ) {
    switch (qrType) {
      case QRTypeEnum.VCard:
        const VCardData = customerData as VCardData;
        return `BEGIN:VCARD
        VERSION:3.0
        N:${VCardData.lastName};${VCardData.firstName}
        FN:${VCardData.firstName} ${VCardData.lastName}
        TEL;TYPE=CELL:${VCardData.phoneNumber}
        EMAIL:${VCardData.email}
        END:VCARD`;
    }
  }
}
