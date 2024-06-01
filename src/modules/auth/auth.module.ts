import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { AccountModule } from '../account/account.module';
import { TokenModule } from '../jwt/jwt.module';
import { PasswordService } from '../utils/password.service';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [TokenModule, UserModule, AccountModule],
  controllers: [AuthController],
  providers: [AuthService, PasswordService],
})
export class AuthModule {}
