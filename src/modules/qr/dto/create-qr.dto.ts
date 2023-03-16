import {
  CustomerData,
  EventData,
  LocationData,
  URLData,
  VCardData,
  WiFiData,
} from '../customer-data.interface';
import { QRTypeEnum } from '../qr-type.enum';
import { IsDefined, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateQrDto {
  @IsDefined()
  @Type(() => Object)
  readonly customerData:
    | CustomerData
    | VCardData
    | WiFiData
    | URLData
    | LocationData
    | EventData;

  readonly customer_id: string;

  @IsEnum(QRTypeEnum)
  readonly type: QRTypeEnum;
}
