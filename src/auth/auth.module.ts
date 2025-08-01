import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { PrismaModule } from "../prisma/prisma.module";
import { UsersModule } from "../users/users.module";
import { MailModule } from "../mail/mail.module";
import { AccessTokenStrategy, RefreshTokenStrategy } from "../common/strategies";

@Module({
  imports: [JwtModule.register({}), PrismaModule, UsersModule, MailModule],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
})
export class AuthModule {}
