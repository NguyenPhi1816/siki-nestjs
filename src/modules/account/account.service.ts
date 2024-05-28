import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { CreateAccountDto } from 'src/dto/CreateAccountDto';
import { Account } from 'src/schemas/account.schema';
import { PasswordService } from '../utils/password.service';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<Account>,
    private readonly passwordService: PasswordService,
  ) {}

  async create(
    createAccountDto: CreateAccountDto,
    session: ClientSession,
  ): Promise<Account> {
    const existedAccount = await this.findAccountByPhoneNumber(
      createAccountDto.phoneNumber,
    );
    if (existedAccount) {
      throw new ConflictException('Số điện thoại này đã được sử dụng');
    }
    const hashedPassword = await this.passwordService.hashPassword(
      createAccountDto.password,
    );
    const newAccount = { ...createAccountDto, password: hashedPassword };
    const createdAccount = new this.accountModel(newAccount);
    return createdAccount.save({ session });
  }

  async authenticate(phoneNumber: string, password: string): Promise<Account> {
    const account = await this.findAccountByPhoneNumber(phoneNumber);

    if (
      !account ||
      !(await this.passwordService.comparePasswords(password, account.password))
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return account;
  }

  async findAccountByPhoneNumber(phoneNumber: string): Promise<Account> {
    return this.accountModel.findOne({ phoneNumber }).exec();
  }

  async findAll(): Promise<Account[]> {
    return this.accountModel.find().exec();
  }
}
