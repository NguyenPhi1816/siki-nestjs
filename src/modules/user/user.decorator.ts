import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export const AuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const jwtService = new JwtService({
      secret: process.env.JWT_ACCESS_SECRET,
    });
    const token = request.headers.authorization?.split(' ')[1];
    return jwtService.verify(token);
  },
);
