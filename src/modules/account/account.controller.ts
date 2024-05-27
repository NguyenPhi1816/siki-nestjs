import { Controller, Get, Post, Body } from '@nestjs/common';
import { AccountService } from './account.service';

@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  async create(@Body() createAccountDto: any) {
    return this.accountService.create(createAccountDto);
  }

  @Get()
  async findAll() {
    return this.accountService.findAll();
  }
}
