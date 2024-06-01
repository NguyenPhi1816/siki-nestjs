import { Body, Controller, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from 'src/dto/SignUpDto';
import { SignInRequestDto } from 'src/types/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post('signin')
  signin(@Body() signInRequestDto: SignInRequestDto) {
    return this.authService.signin(signInRequestDto);
  }
}
