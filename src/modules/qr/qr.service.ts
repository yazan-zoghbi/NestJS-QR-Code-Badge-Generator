import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as QRCode from 'qrcode';
import { CreateQrDto } from './dto/create-qr.dto';
import { QrBadge } from './schemas/qr.schema';
import { QrRepository } from './qr.repository';
import { CustomerRepository } from '../customer/customer.repository';

@Injectable()
export class QrService {
  constructor(
    @InjectModel(QrBadge.name) private qrModel: Model<QrBadge>,
    private readonly qrRepository: QrRepository,
    private readonly customerRepository: CustomerRepository,
  ) {}

  async generateQrCode(createQrDto: CreateQrDto) {
    const qrCodeData = await QRCode.toDataURL(createQrDto.data);
    const qrCodeImage = await QRCode.toBuffer(createQrDto.data);
  
    const customer = await this.customerRepository.findById(createQrDto.customer_id);
    const qrType = await this.qrRepository.findQrTypeById(createQrDto.type_id);
  
    const qrCode = await this.qrRepository.createQrCode({
      data: qrCodeData,
      image: qrCodeImage,
      customer_id: customer,
      type_id: qrType,
    });
    

    return qrCode;
  }
  
  
}
