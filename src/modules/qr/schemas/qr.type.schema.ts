import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { QRTypeEnum } from '../qr-type.enum';

export type QrTypeDocument = QrType & Document;

@Schema()
export class QrType {
  @Prop()
  name: QRTypeEnum;
}

export const QrTypeSchema = SchemaFactory.createForClass(QrType);
