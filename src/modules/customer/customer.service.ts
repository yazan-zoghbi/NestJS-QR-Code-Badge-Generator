import { Injectable } from '@nestjs/common';
import { CustomerRepository } from './customer.repository';
import { Customer } from './schema/customer.schema';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Injectable()
export class CustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    return this.customerRepository.create(createCustomerDto);
  }

  async findAll(): Promise<Customer[]> {
    return this.customerRepository.findAll();
  }

  async findById(id: string): Promise<Customer> {
    return this.customerRepository.findById(id);
  }

  async findByEmail(email: string): Promise<Customer> {
    return this.customerRepository.findByEmail(email);
  }

  async update(id: string, updateCustomerDto: CreateCustomerDto): Promise<Customer> {
    return this.customerRepository.update(id, updateCustomerDto);
  }

  async delete(id: string): Promise<Customer> {
    return this.customerRepository.delete(id);
  }
}
