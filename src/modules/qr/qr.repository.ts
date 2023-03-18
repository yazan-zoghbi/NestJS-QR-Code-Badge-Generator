import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QRTypeEnum } from './qr-type.enum';
import { QrBadge } from './schemas/qr.schema';
import { QrStats } from './schemas/qr.stats.schema';
import { QrType } from './schemas/qr.type.schema';

@Injectable()
export class QrRepository {
  constructor(
    @InjectModel(QrBadge.name) private qrCodeModel: Model<QrBadge>,
    @InjectModel(QrStats.name) private qrStatsModel: Model<QrStats>,
    @InjectModel(QrType.name) private qrTypeModel: Model<QrType>,
  ) {}

  async createQrCode(qrCode: QrBadge): Promise<QrBadge> {
    console.log(qrCode.customer_id, qrCode.type);
    const createdQrCode = await new this.qrCodeModel(qrCode).save();
    const qrCodeWithId = {
      ...createdQrCode.toObject(),
      id: createdQrCode._id.toString(),
    };

    return qrCodeWithId;
  }

  async updateQrCode(qrCodeId, customerId, typeId) {
    const filter = { _id: qrCodeId };
    const update = { customerId, typeId };
    const options = { new: true }; // return the updated document
    return this.qrCodeModel.findOneAndUpdate(filter, update, options);
  }

  async findQrCodeById(id: string): Promise<QrBadge> {
    return this.qrCodeModel
      .findById(id)
      .populate('customer_Id')
      .populate('type');
  }

  async findQrStatsByQrCodeId(qrCodeId: string): Promise<QrStats[]> {
    return this.qrStatsModel
      .find({ qr_code_id: qrCodeId })
      .populate('qr_code_id');
  }

  async createQrStats(qrStats: QrStats): Promise<QrStats> {
    const createdQrStats = new this.qrStatsModel(qrStats);
    return createdQrStats.save();
  }

  async createQrType(name: string): Promise<QrType> {
    const createdQrType = new this.qrTypeModel(name);
    return createdQrType.save();
  }

  async findQrTypeById(id: string): Promise<QrType> {
    return this.qrTypeModel.findById(id);
  }

  async findQRTypeByName(name: QRTypeEnum): Promise<QrType>{
    const qrType = await this.qrTypeModel.findOne({ name: name }).exec();

    if (!qrType) {
      throw new NotFoundException(`QR type ${name} not found`);
    }

    return qrType;
  }

  async findAllQrTypes(): Promise<QrType[]> {
    return this.qrTypeModel.find();
  }
}
