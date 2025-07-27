import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export const CookieGetter = createParamDecorator(
  (data: string, contex: ExecutionContext): string => {
    const request = contex.switchToHttp().getRequest();
    const refreshToken = request.cookies?.[data];

    if (!refreshToken) {
      throw new UnauthorizedException("Token is not found");
    }

    return refreshToken;
  },
);
