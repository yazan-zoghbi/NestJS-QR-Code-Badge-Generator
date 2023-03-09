import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { QrCode } from './qr.schema';

export type QrStatsDocument = QrStats & Document;

@Schema()
export class QrStats {
  @Prop()
  date: Date;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'QrCode' }] })
  qr_code_id: QrCode;
}

export const QrStatsSchema = SchemaFactory.createForClass(QrStats);
