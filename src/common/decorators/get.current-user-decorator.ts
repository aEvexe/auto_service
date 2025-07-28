import { JwtPayload, JwtPayloadWithRefreshToken } from "../types";
import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";

export const GetCurrentUser = createParamDecorator(
    (data: keyof JwtPayloadWithRefreshToken, context: ExecutionContext) =>{
        const request = context.switchToHttp().getRequest();
        const user = request.user as JwtPayload;
        if(!user){
            throw new ForbiddenException('Token notogri')
        }
        if(!data){
            return user;
        }

        return user[data]
    }
)