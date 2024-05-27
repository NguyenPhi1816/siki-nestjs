import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from 'src/dto/CreateAccountDto';
import { CreateUserDto } from 'src/dto/CreateUserDto';

@Injectable({})
export class AuthService {
  signin() {
    return 'I am signed in';
  }
  signup() {
    return 'I am signed up';
  }
}
