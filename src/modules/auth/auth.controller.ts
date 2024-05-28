import { Body, Controller, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from 'src/dto/SignUpDto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post('signin')
  signin(
    @Body('phoneNumber') phoneNumber: string,
    @Body('password') password: string,
  ) {
    return this.authService.signin(phoneNumber, password);
  }
}
