import {
  Controller,
  Post,
  Body,
  Delete,
  Param,
  Patch,
  Get,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { Customer } from './schema/customer.schema';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  // Should be secured by role guard
  @Get('all')
  async getAll(): Promise<Customer[]> {
    return this.customerService.findAll();
  }

  // will be used for restoring account functionality
  @Get('find/:id')
  async getById(@Param('id') id: string): Promise<Customer> {
    return this.customerService.findById(id);
  }

  @Get('find/email')
  async getByEmail(@Body() email: string): Promise<Customer> {
    return this.customerService.findByEmail(email);
  }

  // Sign up  process
  @Post('create')
  async create(
    @Body() createCustomerDto: CreateCustomerDto,
  ): Promise<Customer> {
    return this.customerService.create(createCustomerDto);
  }

  // Deleting all customer details (including qr codes *not add yet*)
  @Delete('delete/:id')
  async delete(@Param('id') id: string): Promise<Customer> {
    return this.customerService.delete(id);
  }

  // No update customer functionality yet!
  // @Patch('update/:id')
  // async update(@Param('id') id:string, @Body() updatecustomerdto:updateCustomerDto){

  // }
}
