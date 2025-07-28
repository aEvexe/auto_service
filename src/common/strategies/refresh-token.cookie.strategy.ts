import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { Injectable, ForbiddenException } from "@nestjs/common";
import { ExtractJwt, JwtFromRequestFunction, Strategy } from "passport-jwt";
import { JwtPayload, JwtPayloadWithRefreshToken } from "../types";

export const cookieExtractor: JwtFromRequestFunction = (req: Request) => {
    console.log(req.cookies);
    if(req && req.cookies){
        return req.cookies["refreshToken"]
    }
    return null
}

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  "refresh-jwt"
) {
  constructor() {
    super({
      jwtFromRequest: cookieExtractor,
      secretOrKey: process.env.REFRESH_TOKEN_KEY!,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: JwtPayload): JwtPayloadWithRefreshToken {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken){
        throw new ForbiddenException("Refresh token notogri");
    }
    return { ...payload, refreshToken };
  }
}
