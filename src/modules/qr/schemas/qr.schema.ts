import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Customer } from 'src/modules/customer/schema/customer.schema';
import { QrType } from './qr.type.schema';

export type QrCodeDocument = QrBadge & Document;

@Schema()
export class QrBadge {
  @Prop()
  data: string;

  @Prop({ type: Buffer })
  image: Buffer;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Customer' })
  customer_id: Customer;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'QrType' })
  type_id: QrType;
}

export const QrCodeSchema = SchemaFactory.createForClass(QrBadge);
