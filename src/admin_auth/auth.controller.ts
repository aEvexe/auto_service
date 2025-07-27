import { Body, Controller, HttpCode, Post, Res, Param } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateAdminDto } from "../admin/dto/create-admin.dto";
import { ParseIntPipe } from "@nestjs/common";
import { SigninAdminDto } from "../admin/dto/signin-admin.dto";
import { Response } from "express";
import { CookieGetter } from "../common/decorators/cookie-getter.decorator";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(@Body() createAdminDto: CreateAdminDto) {
    return this.authService.register(createAdminDto);
  }

  @Post("login")
  async login(
    @Body() loginAdminDto: SigninAdminDto,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.login(loginAdminDto, res);
  }

  @HttpCode(200)
  @Post("signout")
  signout(
    @CookieGetter("refreshToken") refreshToken: string,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.signout(refreshToken, res);
  }

  @HttpCode(200)
  @Post(":id/refresh")
  refresh(
    @Param("id") id: string,
    @CookieGetter("refreshToken") refreshToken: string,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.refreshToken(id, refreshToken, res);
  }
}
