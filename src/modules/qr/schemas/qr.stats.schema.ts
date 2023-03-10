import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { QrBadge } from './qr.schema';

export type QrStatsDocument = QrStats & Document;

@Schema()
export class QrStats {
  @Prop()
  date: Date;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'QrBadge' }] })
  qr_code_id: QrBadge;
}

export const QrStatsSchema = SchemaFactory.createForClass(QrStats);
