import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as QRCode from 'qrcode';
import { CreateQrDto } from './dto/create-qr.dto';
import { QrBadge } from './schemas/qr.schema';
import { QrRepository } from './qr.repository';
import { CustomerRepository } from '../customer/customer.repository';
import { QRTypeEnum } from './qr-type.enum';
import {
  CustomerData,
  EventData,
  LocationData,
  URLData,
  VCardData,
  WiFiData,
} from './customer-data.interface';

type CustomerDataType = VCardData | URLData | WiFiData | LocationData | EventData | CustomerData;


@Injectable()
export class QrService {
  constructor(
    @InjectModel(QrBadge.name) private qrModel: Model<QrBadge>,
    private readonly qrRepository: QrRepository,
    private readonly customerRepository: CustomerRepository,
  ) {}



  async generateData(qrType: QRTypeEnum, customerData: CustomerDataType, customer_id: string) {
    let data;
    switch (qrType) {
      case QRTypeEnum.VCard:
        if ('firstName' in customerData && 'lastName' in customerData && 'phoneNumber' in customerData) {
          data = `BEGIN:VCARD\nVERSION:2.1\nN:${customerData.lastName};${customerData.firstName}\nFN:${customerData.firstName} ${customerData.lastName}\nTEL:${customerData.phoneNumber}\nEMAIL:${customerData.email}\nEND:VCARD`;
          return data;
        } else {
          throw new BadRequestException('Invalid customer data type for VCard QR');
        }
  
      case QRTypeEnum.URL:
        if ('url' in customerData) {
          data = `URL:${customerData.url}`;
          return data;
        } else {
          throw new BadRequestException('Invalid customer data type for URL QR');
        }
  
      case QRTypeEnum.WiFi:
        if ('ssid' in customerData && 'password' in customerData) {
          data = `WIFI:T:WPA;S:${customerData.ssid};P:${customerData.password};;`;
          return data;
        } else {
          throw new BadRequestException('Invalid customer data type for WiFi QR');
        }
  
      case QRTypeEnum.Location:
        if ('latitude' in customerData && 'longitude' in customerData && 'altitude' in customerData) {
          data = `geo:${customerData.latitude},${customerData.longitude},${customerData.altitude}`;
          return data;
        } else {
          throw new BadRequestException('Invalid customer data type for Location QR');
        }
  
      case QRTypeEnum.Event:
        if (
          'summary' in customerData &&
          'start' in customerData &&
          'end' in customerData &&
          'location' in customerData &&
          'description' in customerData
        ) {
          const start = new Date(customerData.start).toISOString().replace(/[-:]/g, '').slice(0, -5) + 'Z';
          const end = new Date(customerData.end).toISOString().replace(/[-:]/g, '').slice(0, -5) + 'Z';
          data = `BEGIN:VEVENT\nSUMMARY:${customerData.summary}\nDTSTART:${start}\nDTEND:${end}\nLOCATION:${customerData.location}\nDESCRIPTION:${customerData.description}\nEND:VEVENT`;
          return data;
        } else {
          throw new BadRequestException('Invalid customer data type for Event QR');
        }
  
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
