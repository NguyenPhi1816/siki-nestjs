import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenPayloadDto } from 'src/types/token.dto';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  async createAccessToken(payload: TokenPayloadDto): Promise<string> {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN + 's',
    });
  }

  async createRefreshToken(payload: TokenPayloadDto): Promise<string> {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN + 's',
    });
  }

  async getAccessExpire(): Promise<number> {
    return Number.parseInt(process.env.JWT_ACCESS_EXPIRES_IN);
  }

  async getRefreshExpire(): Promise<number> {
    return Number.parseInt(process.env.JWT_REFRESH_EXPIRES_IN);
  }

  async validateAccessToken(token: string): Promise<any> {
    return this.jwtService.verify(token, {
      secret: process.env.JWT_ACCESS_SECRET,
    });
  }

  async validateRefreshToken(token: string): Promise<any> {
    return this.jwtService.verify(token, {
      secret: process.env.JWT_REFRESH_SECRET,
    });
  }
}
