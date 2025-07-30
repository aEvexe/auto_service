import { Body, Controller, HttpCode, Post, Res, Param } from "@nestjs/common";
import { CreateAdminDto } from "../admin/dto/create-admin.dto";
import { ParseIntPipe } from "@nestjs/common";
import { SigninAdminDto } from "../admin/dto/signin-admin.dto";
import { Response } from "express";
import { CookieGetter } from "../common/decorators/cookie-getter.decorator";
import { AdminAuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AdminAuthService) {}

  @Post("register")
  async register(@Body() createAdminDto: CreateAdminDto) {
    return this.authService.signup(createAdminDto);
  }

  @Post("login")
  async login(
    @Body() signinAdminDto: SigninAdminDto,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.signin(signinAdminDto, res);
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
