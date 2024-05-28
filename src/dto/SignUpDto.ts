import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CreateUserDto } from './CreateUserDto';
import { CreateAccountDto } from './CreateAccountDto';

export class SignupDto {
  @ValidateNested()
  @Type(() => CreateUserDto)
  user: CreateUserDto;

  @ValidateNested()
  @Type(() => CreateAccountDto)
  account: CreateAccountDto;
}
