import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { SignupDto } from 'src/dto/SignUpDto';
import { AccountService } from '../account/account.service';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { TokenService } from '../jwt/jwt.service';
import { TokenPayloadDto } from 'src/types/token.dto';
import { SignInRequestDto, AuthResponseDto } from 'src/types/auth.dto';
import { User } from 'src/schemas/user.schema';
import { PasswordService } from '../utils/password.service';

@Injectable({})
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
    private readonly accountService: AccountService,
    private readonly passwordService: PasswordService,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async authenticate(phoneNumber: string, password: string): Promise<User> {
    const account =
      await this.accountService.findAccountByPhoneNumber(phoneNumber);

    if (!account) {
      return null;
    }

    const isPasswordMatched = await this.passwordService.comparePasswords(
      password,
      account.password,
    );
    if (!isPasswordMatched) {
      return null;
    }

    return this.userService.findByPhoneNumber(phoneNumber);
  }

  async signin(signInRequestDto: SignInRequestDto): Promise<AuthResponseDto> {
    try {
      const { phoneNumber, password } = signInRequestDto;
      const user = await this.authenticate(phoneNumber, password);
      if (user) {
        const payload: TokenPayloadDto = {
          username: user.email,
          sub: user.phoneNumber,
        };
        const access_token = await this.tokenService.createAccessToken(payload);
        const refresh_token =
          await this.tokenService.createRefreshToken(payload);
        const access_expire = await this.tokenService.getAccessExpire();
        const refresh_expire = await this.tokenService.getRefreshExpire();

        const response: AuthResponseDto = {
          access_token: access_token,
          expires_in: access_expire,
          refresh_expires_in: refresh_expire,
          refresh_token: refresh_token,
          token_type: 'Bearer',
          'not-before-policy': 0,
          session_state: '9d7e7a64-85ca-4343-85c7-835d5b360f37',
          scope: 'microprofile-jwt profile email',
        };

        return response;
      } else {
        throw new BadRequestException('Invalid Credentials');
      }
    } catch (error) {
      throw new BadRequestException(error.message);
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

      const payload: TokenPayloadDto = {
        sub: createdUser.phoneNumber,
        username: createdUser.email,
      };

      const access_token = await this.tokenService.createAccessToken(payload);
      const refresh_token = await this.tokenService.createRefreshToken(payload);
      const access_expire = await this.tokenService.getAccessExpire();
      const refresh_expire = await this.tokenService.getRefreshExpire();

      const response: AuthResponseDto = {
        access_token: access_token,
        expires_in: access_expire,
        refresh_expires_in: refresh_expire,
        refresh_token: refresh_token,
        token_type: 'Bearer',
        'not-before-policy': 0,
        session_state: '9d7e7a64-85ca-4343-85c7-835d5b360f37',
        scope: 'microprofile-jwt profile email',
      };

      return response;
    } catch (error) {
      await session.abortTransaction();
      throw new ConflictException(error);
    } finally {
      session.endSession();
    }
  }
}
