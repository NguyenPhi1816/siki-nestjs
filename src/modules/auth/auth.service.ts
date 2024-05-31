import { ConflictException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { SignupDto } from 'src/dto/SignUpDto';
import { AccountService } from '../account/account.service';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';

@Injectable({})
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly userService: UserService,
    private readonly accountService: AccountService,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async signin(phoneNumber: string, password: string) {
    const account = this.accountService.authenticate(phoneNumber, password);
    if (account) {
      const user = await this.userService.findByPhoneNumber(phoneNumber);
      const payload = { username: user.email, sub: user.phoneNumber };
      return {
        ...user.toJSON(),
        access_token: this.jwtService.sign(payload),
      };
    }
  }

  async signup(signupDto: SignupDto) {
    const { user, account } = signupDto;
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const createdUser = await this.userService.create(user, session);
      if (!createdUser) {
        throw new Error('Failed to create user');
      }

      const createdAccount = await this.accountService.create(account, session);
      if (!createdAccount) {
        throw new Error('Failed to create account');
      }

      await session.commitTransaction();

      const payload = {
        sub: createdUser.phoneNumber,
        username: createdUser.email,
      };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      await session.abortTransaction();
      throw new ConflictException(error);
    } finally {
      session.endSession();
    }
  }
}
