import { Injectable } from "@nestjs/common";
import { QrRepository } from "./qr.repository";

@Injectable()
export class QrTypeService {
    constructor(private readonly qrRepository:QrRepository){}

    async create(name: string){
        return this.qrRepository.createQrType(name)
    }
}