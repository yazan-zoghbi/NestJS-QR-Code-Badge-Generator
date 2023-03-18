import { BadRequestException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { DatabaseModule } from '../../shared/database/database.module';
import databaseConfig from '../../config/database-config';
import { CustomerModule } from '../customer/customer.module';
import { Customer, CustomerSchema } from '../customer/schema/customer.schema';
import {
  EventData,
  LocationData,
  URLData,
  VCardData,
  WiFiData,
} from './customer-data.interface';
import { QRTypeEnum } from './qr-type.enum';
import { QrController } from './qr.controller';
import { QrModule } from './qr.module';
import { QrRepository } from './qr.repository';
import { QrService } from './qr.service';
import { QrTypeService } from './qr.type.service';
import { QrBadge, QrCodeSchema } from './schemas/qr.schema';
import { QrStats, QrStatsSchema } from './schemas/qr.stats.schema';
import { QrType, QrTypeSchema } from './schemas/qr.type.schema';
import { CustomerRepository } from '../customer/customer.repository';
import { CreateQrDto } from './dto/create-qr.dto';
import mongoose from 'mongoose';

describe('QrService', () => {
  let qrService: QrService;
  let qrRepository: QrRepository;
  let customerRepository: CustomerRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        QrModule,
        ConfigModule.forRoot({ isGlobal: true, load: [databaseConfig] }),
        MongooseModule.forFeature([
          { name: QrBadge.name, schema: QrCodeSchema },
          { name: QrStats.name, schema: QrStatsSchema },
          { name: QrType.name, schema: QrTypeSchema },
          { name: Customer.name, schema: CustomerSchema },
        ]),
        CustomerModule,
      ],
      controllers: [QrController],
      providers: [QrService, QrRepository, QrTypeService],
    }).compile();

    qrService = moduleRef.get<QrService>(QrService);
    qrRepository = moduleRef.get<QrRepository>(QrRepository);
    customerRepository = moduleRef.get<CustomerRepository>(CustomerRepository);
  });

  describe('generateData', () => {
    it('should generate VCard data', async () => {
      const customerData: VCardData = {
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '+123456789',
        email: 'john.doe@example.com',
      };
      const data = await qrService.generateData(
        QRTypeEnum.VCard,
        customerData,
        '1',
      );
      expect(data).toBe(
        'BEGIN:VCARD\nVERSION:2.1\nN:Doe;John\nFN:John Doe\nTEL:+123456789\nEMAIL:john.doe@example.com\nEND:VCARD',
      );
    });

    it('should throw BadRequestException for invalid VCard data', async () => {
      const customerData: URLData = {
        url: 'https://example.com',
      };
      await expect(
        qrService.generateData(QRTypeEnum.VCard, customerData, '1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should generate URL data', async () => {
      const customerData: URLData = {
        url: 'https://example.com',
      };
      const data = await qrService.generateData(
        QRTypeEnum.URL,
        customerData,
        '1',
      );
      expect(data).toBe('URL:https://example.com');
    });

    it('should generate Location data', async () => {
      const customerData: LocationData = {
        altitude: '1000',
        longitude: '-118.2437',
        latitude: '34.0522',
      };
      const data = await qrService.generateData(
        QRTypeEnum.Location,
        customerData,
        '1',
      );
      expect(data).toBe('geo:34.0522,-118.2437,1000');
    });

    it('should generate WiFi data', async () => {
      const customerData: WiFiData = {
        ssid: 'testname',
        password: 'testpassword',
      };
      const data = await qrService.generateData(
        QRTypeEnum.WiFi,
        customerData,
        '1',
      );
      expect(data).toBe('WIFI:T:WPA;S:testname;P:testpassword;;');
    });

    it('should generate Event data', async () => {
      const customerData: EventData = {
        summary: 'event summary',
        start: '2023-04-01T10:00:00Z',
        end: '2023-04-01T12:00:00Z',
        description: 'This is a description of my event',
        location: '123 Main St, Anytown USA',
      };
      const data = await qrService.generateData(
        QRTypeEnum.Event,
        customerData,
        '1',
      );
      expect(data).toBe(
        'BEGIN:VEVENT\nSUMMARY:event summary\nDTSTART:20230401T100000Z\nDTEND:20230401T120000Z\nLOCATION:123 Main St, Anytown USA\nDESCRIPTION:This is a description of my event\nEND:VEVENT',
      );
    });
  });

  describe('generateQrCode', () => {
    it('should generate a QR code for a customer', async () => {
      const customer = new Customer();
      customer.username = 'John';
      customer.password = 'test12345';
      customer.email = 'john.doe@example.com';

      const customer_id = new mongoose.Types.ObjectId().toString();

      const qrType = new QrType();
      qrType.name = QRTypeEnum.VCard;

      jest.spyOn(qrService, 'generateData').mockResolvedValue('test_data');
      jest.spyOn(customerRepository, 'findById').mockResolvedValue(customer);
      jest.spyOn(qrRepository, 'findQRTypeByName').mockResolvedValue(qrType);
      jest.spyOn(qrRepository, 'createQrCode').mockResolvedValue(new QrBadge());

      const createQrDto: CreateQrDto = {
        type: QRTypeEnum.VCard,
        customerData: {
          firstName: 'John',
          lastName: 'Doe',
          phoneNumber: '+123456789',
          email: 'john.doe@example.com',
        },
        customer_id: customer_id,
      };

      const qrCode = await qrService.generateQrCode(createQrDto);

      expect(qrService.generateData).toHaveBeenCalledWith(
        QRTypeEnum.VCard,
        createQrDto.customerData,
        customer_id,
      );
      expect(qrRepository.findQRTypeByName).toHaveBeenCalledWith(
        QRTypeEnum.VCard,
      );
      expect(customerRepository.findById).toHaveBeenCalledWith(customer_id);
      expect(qrRepository.createQrCode).toHaveBeenCalledWith(
        expect.any(QrBadge),
      );

      expect(qrCode).toBeInstanceOf(QrBadge);
      expect(qrCode.customer_id).toEqual(customer);
    });
  });
});
