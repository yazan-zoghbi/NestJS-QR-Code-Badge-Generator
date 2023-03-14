import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as QRCode from 'qrcode';
import { CreateQrDto } from './dto/create-qr.dto';
import { QrBadge } from './schemas/qr.schema';
import { QrRepository } from './qr.repository';
import { CustomerRepository } from '../customer/customer.repository';
import { QRTypeEnum } from './qr-type.enum';
import { CustomerData, VCardData } from './customer-data.interface';

@Injectable()
export class QrService {
  constructor(
    @InjectModel(QrBadge.name) private qrModel: Model<QrBadge>,
    private readonly qrRepository: QrRepository,
    private readonly customerRepository: CustomerRepository,
  ) {}

  async generateData(
    qrType: QRTypeEnum,
    customerData: CustomerData | VCardData,
    customer_id: string,
  ) {
    switch (qrType) {
      case QRTypeEnum.VCard:
        const VCardData = customerData as VCardData;
        const data = `BEGIN:VCARD\nVERSION:2.1\nN:${VCardData.lastName};${VCardData.firstName}\nFN:${VCardData.firstName} ${VCardData.lastName}\nTEL:${VCardData.phoneNumber}\nEMAIL:${VCardData.email}\nEND:VCARD`;
        return data;

      default:
        throw new BadRequestException('Invalid QR type');
    }
  }

  async generateQrCode(createQrDto: CreateQrDto): Promise<QrBadge> {
    const { type, customerData, customer_id } = createQrDto;
    const data = await this.generateData(type, customerData, customer_id);
    const qrCodeData = await QRCode.toDataURL(data);
    const qrCodeImage = await QRCode.toBuffer(data);
    const qrType = createQrDto.type;
    const qrTypeid = await this.qrRepository.findQRTypeByName(qrType);

    const customer = await this.customerRepository.findById(
      createQrDto.customer_id,
    );

    const qrCode = new QrBadge();
    qrCode.data = qrCodeData;
    qrCode.image = qrCodeImage;
    qrCode.customer_id = customer;
    qrCode.type = qrTypeid;

    const createdQrCode = await this.qrRepository.createQrCode(qrCode);

    if (createdQrCode) {
      await this.customerRepository.addQrCodeAfterGenerated(
        createQrDto.customer_id,
        createdQrCode.id,
      );
    }

    return qrCode;
  }
}
