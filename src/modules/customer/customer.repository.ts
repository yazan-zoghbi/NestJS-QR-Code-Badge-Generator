import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer } from './schema/customer.schema';

@Injectable()
export class CustomerRepository {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
  ) {}

  async create(customer: Customer): Promise<Customer> {
    const createdCustomer = new this.customerModel(customer);
    return await createdCustomer.save();
  }

  async findByEmail(email: string): Promise<Customer> {
    return await this.customerModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<Customer> {
    return await this.customerModel.findById(id).exec();
  }

  async update(id: string, customer: Customer): Promise<Customer> {
    return await this.customerModel.findByIdAndUpdate(id, customer, {
      new: true,
    });
  }

  async delete(id: string): Promise<Customer> {
    return await this.customerModel.findByIdAndRemove(id);
  }

  async findAll(): Promise<Customer[]> {
    return await this.customerModel.find().exec();
  }

  async addQrCode(customer_id: string, qrCodeId: string) {
    return await this.customerModel.updateOne(
      { _id: customer_id },
      { qr_code_id: qrCodeId },
    );
  }
}
