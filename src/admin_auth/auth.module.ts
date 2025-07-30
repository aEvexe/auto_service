import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AdminModule } from '../admin/admin.module';
import { PrismaModule } from '../prisma/prisma.module';
import { AccessTokenStrategy, RefreshTokenStrategy } from '../common/strategies';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [JwtModule.register({}), PrismaModule, AdminModule],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
})
export class AdminAuthModule {}
