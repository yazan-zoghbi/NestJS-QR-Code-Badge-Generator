import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Customer } from 'src/modules/customer/schema/customer.schema';
import { QrType } from './qr.type.schema';

export type QrCodeDocument = QrCode & Document;

@Schema()
export class QrCode {
  @Prop()
  data: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }] })
  customer_Id: Customer;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'QrType' }] })
  type_id: QrType;
}

export const QrCodeSchema = SchemaFactory.createForClass(QrCode);
