import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/schemas/user.schema';
import { JwtAuthGuard } from '../jwt/jwt.guard';
import { AuthUser } from './user.decorator';
import { TokenPayloadDto } from 'src/types/token.dto';
import { ProfileResponseDto } from 'src/types/user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  async getProfile(
    @AuthUser() payload: TokenPayloadDto,
  ): Promise<ProfileResponseDto> {
    return this.userService.getProfile(payload);
  }

  @Get()
  async findAll() {
    return this.userService.findAll();
  }
}
