import { Controller, Post, Body } from '@nestjs/common';
import { QrService } from './qr.service';
import { CreateQrDto } from './dto/create-qr.dto';
import { QrTypeService } from './qr.type.service';

@Controller('qr')
export class QrController {
  constructor(
    private readonly qrService: QrService,
    private readonly qrTypeService: QrTypeService,
  ) {}

  @Post('/generate')
  async generateQrCode(@Body() createQrDto: CreateQrDto) {
    const qrCode = await this.qrService.generateQrCode(createQrDto);
    return qrCode;
  }

  // Create QR Type Route
  @Post('type/create')
  async createQrType(@Body() name: string) {
    const qrType = await this.qrTypeService.create(name);
    return qrType;
  }
}
