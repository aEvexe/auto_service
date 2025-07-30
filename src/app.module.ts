import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { AdminAuthModule } from "./admin_auth/auth.module";
import { AdminModule } from "./admin/admin.module";
import { CarModule } from './car/car.module';
import { CarHistoryModule } from './car-history/car-history.module';
import { RegionsModule } from './regions/regions.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ".env", isGlobal: true }, ),
    PrismaModule,
    UsersModule,
    AuthModule,
    AdminModule,
    AuthModule,
    CarModule,
    CarHistoryModule,
    RegionsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
