import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type QrTypeDocument = QrType & Document;

@Schema()
export class QrType {
  @Prop()
  name: string;
}

export const QrTypeSchema = SchemaFactory.createForClass(QrType);
